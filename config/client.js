// default configs

module.exports = () => {
  return {
    apiEndpoint: process.env.KORONA_API_ENDPOINT || 'https://www.koronacloud.com/web/api',
    apiToken: process.env.KORONA_API_TOKEN || '123abc'
  }
}
