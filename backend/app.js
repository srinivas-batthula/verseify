const express = require('express');
const passport = require('passport')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
const cors = require('cors')
const helmet = require('helmet')
const path = require("path")
const MainRouter = require('./routes/MainRouter')
const errorHandler = require('./utils/errorHandler')
const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require("./swagger.json")



const app = express();

app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }))

app.use(express.json())

app.use(cookieParser())

app.use(express.static('public'))

const corsOptions = {
    origin: ['https://verseify.netlify.app', 'https://srinivas-batthula.github.io', 'http://localhost:3000'], // Allow frontend domain
    credentials: true,               // Allow credentials (cookies)
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600,
}
app.use('/', cors(corsOptions))

app.options('/', cors(corsOptions))

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 22, // limit each IP to 26 requests per windowMs
    message: 'Too many requests from this IP, please try again after 2 minutes',
    headers: true,
})
app.use(limiter)

app.use(helmet())

app.use(passport.initialize())      //Initialize OAuth2.0

app.get('/', (req, res) => {
    return res.json({ 'status': 'success', 'details': `You are Viewing a Non-API Route (${req.url}), Use '/api/' for all other endpoints to access them` })
})

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// API Starter...
app.use('/api', MainRouter)

app.use((req, res) => {
    return res.status(404).json({ 'status': 'Not Found', 'details': `Requested path/method {${req.url} & ${req.method}} Not Found` })
})

app.use(errorHandler)


module.exports = app;
