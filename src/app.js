import 'dotenv/config'
import express from 'express'
import router from './routes/index'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()

// Enable CORS
app.use(cors())

// Enable body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Attach router
app.use('/', router)

export default app
