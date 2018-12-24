import 'dotenv/config'
import app from './app'
import connect from './models/connect'

// Connect database
connect()

const port = 3000
app.listen(port, () => console.log(`Bender listening on port ${port}`))
