import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import payload from 'payload'
import { seed } from './index.js'
import payloadConfig from '../payload.config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
})

const seedDB = async () => {
  await payload.init({
    ...payloadConfig,
    secret: process.env.PAYLOAD_SECRET || '',
    local: true,
    onInit: async (payload) => {
      await seed(payload)
      process.exit(0)
    },
  })
}

seedDB()
