import 'dotenv/config'
import express from 'express'
import router from './routes'
import cors from 'cors'

const app = express()

// Enable CORS
app.use(cors())

// Attach router
app.use('/', router)

export default app
