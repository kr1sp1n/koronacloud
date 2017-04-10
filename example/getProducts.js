process.env.DEBUG = 'koronacloud'

const client = require('./../src/index')()

client.getProducts({ num: 1 })
.then(console.log)
.catch(console.error)
