import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import payload from 'payload'
import config from '../payload.config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
})

const seed = async (payload: any): Promise<void> => {
  payload.logger.info('Seeding database...')

  // Create admin user if it doesn't exist
  const { docs: existingUsers } = await payload.find({
    collection: 'users',
    limit: 1,
  })

  if (existingUsers.length === 0) {
    payload.logger.info('Creating admin user...')

    try {
      await payload.create({
        collection: 'users',
        data: {
          email: 'admin@example.com',
          password: 'password123',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
        },
      })

      await payload.create({
        collection: 'users',
        data: {
          email: 'user@example.com',
          password: 'password123',
          firstName: 'Regular',
          lastName: 'User',
          role: 'user',
        },
      })

      payload.logger.info('Admin and regular users created successfully')
    } catch (error) {
      payload.logger.error('Error creating users:')
      payload.logger.error(error)
    }
  }

  payload.logger.info('Seeding complete')
}

const seedDB = async (): Promise<void> => {
  console.log('PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET)

  await payload.init({
    // Pass the config directly
    ...config,
    secret: process.env.PAYLOAD_SECRET,
    local: true,
    onInit: async (payload) => {
      await seed(payload)
      process.exit(0)
    },
  })
}

seedDB()
