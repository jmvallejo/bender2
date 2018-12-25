import { getMongoURI } from '../models/connect'
import seeder from 'mongoose-seed'

const data = [
  {
    model: 'User',
    documents: [
      {
        email: 'jmvallejo@gmail.com',
        password: 'bender',
        name: 'Juan Manuel Vallejo',
        isAdmin: true,
        isApproved: true
      }
    ]
  }
]

const mongoURI = getMongoURI()
console.log('Connecting to mongodb...')
seeder.connect(
  mongoURI,
  () => {
    // Load Mongoose models
    console.log('Loading models...')
    seeder.loadModels(['src/models/user.js'])

    // Clear specified collections
    console.log('Clearing collections...')
    seeder.clearModels(['User'], () => {
      // Callback to populate DB once collections have been cleared
      console.log('Populating specified models...')
      seeder.populateModels(data, () => {
        console.log('Done, disconnecting...')
        seeder.disconnect()
      })
    })
  }
)
