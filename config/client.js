// default configs

module.exports = () => {
  return {
    apiEndpoint: process.env.API_ENDPOINT || 'https://www.koronacloud.com/web/api/v2',
    apiToken: process.env.API_TOKEN || '123abc'
  }
}
