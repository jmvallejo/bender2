import 'dotenv/config'
import express from 'express'
import router from './routes'

const app = express()
const port = 3000

// Attach router
app.use('/', router)

app.listen(port, () => console.log(`Bender listening on port ${port}`))