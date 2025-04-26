import { Endpoint } from 'payload/config'
import { sessionEndpoints } from './sessions'

// Combine all endpoints
export const endpoints: Endpoint[] = [
  ...sessionEndpoints,
]

export default endpoints
