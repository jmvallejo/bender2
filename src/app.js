import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import indexRouter from './routes/index'
import usersRouter from './routes/users'

const app = express()

// Enable CORS
app.use(cors())

// Enable body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Attach routers
app.use('/', indexRouter)
app.use('/user', usersRouter)

export default app
