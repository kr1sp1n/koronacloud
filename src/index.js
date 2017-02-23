let debug = require('debug')('koronacloud')
let mustache = require('mustache')
let Promise = require('bluebird')
let rp = require('request-promise')
let tv4 = require('tv4')

let commands = require('./commands')()
let defaultConfig = require('./../config/client')()

const requestSchema = {
  type: 'object',
  properties: {
    path: {
      type: 'string'
    },
    method: {
      type: 'string'
    }
  },
  required: ['path', 'method']
}

function handleApiResponse (response) {
  if (!response) return Promise.reject(new Error('No response passed'))
  debug(response.statusCode)
  // if (response.statusCode !== 200 && response.statusCode !== 204) {
  //   // handle health response not as error
  //   if (response.request.path.match(/health/) !== null) {
  //     return Promise.resolve(response.body);
  //   }
  //   let message;
  //   if (response.body && response.body.errors && response.body.errors.length > 0) {
  //     message = response.body.errors[0];
  //   } else {
  //     message = `Status ${response.statusCode}`;
  //   }
  //   const error = new Error(message);
  //   error.response = response;
  //   return Promise.reject(error);
  // }
  return Promise.resolve(response.body)
}

module.exports = (config) => {
  config = config || defaultConfig

  mustache = config.mustache || mustache
  Promise = config.Promise || Promise
  rp = config['request-promise'] || rp
  tv4 = config.tv4 || tv4

  commands = config.commands || commands

  const client = {}

  client.apiEndpoint = config.apiEndpoint
  client.apiToken = config.apiToken

  client.request = (options = {}) => {
    const valid = tv4.validate(options, requestSchema)
    if (!valid) return Promise.reject(tv4.error)
    let uri = `${client.apiEndpoint}${options.path}`
    options.json = Object.assign({}, { token: client.apiToken }, options.json)
    // Replace variables in uri.
    uri = mustache.render(uri, options.json)
    // Replace unicode encodings.
    uri = uri.replace(/&#x2F;/g, '/')
    options.headers = options.headers || {}
    // if (client.token !== undefined || client.token !== null || client.token !== '') {
    //   options.headers['X-Vault-Token'] = client.token
    // }
    options.uri = uri
    options.json = options.json || true
    options.simple = options.simple || false
    options.resolveWithFullResponse = options.resolveWithFullResponse || true
    debug(options.method, uri)
    debug(options.json)
    return rp(options).then(handleApiResponse)
  }

  function validate (json, schema) {
    // ignore validation if no schema
    if (schema === undefined) return Promise.resolve()
    const valid = tv4.validate(json, schema)
    if (!valid) {
      debug(tv4.error.dataPath)
      debug(tv4.error.message)
      return Promise.reject(tv4.error)
    }
    return Promise.resolve()
  }

  function extendRequestOptions (conf, options) {
    const schema = conf.schema.query
    // no schema for the query -> no need to extend
    if (!schema) return Promise.resolve(options)
    const params = []
    for (const key of Object.keys(schema.properties)) {
      if (key in options.json) {
        params.push(`${key}=${encodeURIComponent(options.json[key])}`)
      }
    }
    if (params.length > 0) {
      options.path += `?${params.join('&')}`
    }
    return Promise.resolve(options)
  }

  function generateFunction (name, conf) {
    client[name] = (args = {}) => {
      const options = Object.assign({}, config.requestOptions, args.requestOptions)
      options.method = conf.method
      options.path = conf.path
      options.json = args
      // no schema object -> no validation
      if (!conf.schema) return client.request(options)
      // else do validation of request URL and body
      return validate(options.json, conf.schema.req)
      .then(validate(options.json, conf.schema.query))
      .then(() => extendRequestOptions(conf, options))
      .then((extendedRequestOptions) => client.request(extendedRequestOptions))
    }
  }

  const assignFunction = commandName => generateFunction(commandName, commands[commandName])
  Object.keys(commands).forEach(assignFunction)

  return client
}
