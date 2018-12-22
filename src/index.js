import 'dotenv/config'
import express from 'express'
import router from './routes'
import cors from 'cors'

const app = express()
const port = 3000

// Enable CORS
app.use(cors())

// Attach router
app.use('/', router)

app.listen(port, () => console.log(`Bender listening on port ${port}`))
