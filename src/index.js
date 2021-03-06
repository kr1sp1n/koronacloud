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
  debug(response.body)
  return Promise.resolve(response.body)
}

module.exports = (config) => {
  config = Object.assign({}, defaultConfig, config)
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
    // Replace variables in uri.
    uri = mustache.render(uri, Object.assign({}, options.json, { token: client.apiToken }))
    // Replace unicode encodings.
    uri = uri.replace(/&#x2F;/g, '/')
    options.headers = options.headers || {}
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
