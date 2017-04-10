process.env.DEBUG = 'koronacloud'

const client = require('./../src/index')()

client.getCashiers({ limit: 5 })
.then(console.log)
.catch(console.error)
