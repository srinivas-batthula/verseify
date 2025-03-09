// require("dotenv").config({path: './config.env'})
// const { createClient } = require('redis')


// const redisClient = createClient({
//     username: 'default',
//     socket: {
//         host: process.env.REDIS_HOST,
//         port: process.env.REDIS_PORT,
//         keepAlive: true, // Keep connection alive
//         reconnectStrategy: (retries) => Math.min(retries * 50, 5000), // Auto-reconnect
//     },
//     password: process.env.REDIS_PASSWORD,
// })

// redisClient.connect()
//     .then(() => console.log('Redis Cloud Connected'))
//     .catch(err => console.error('Redis Connection Error:', err));


// redisClient.on('error', (err) => console.error('Redis Error:', err))


// module.exports = redisClient
