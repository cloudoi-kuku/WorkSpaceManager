import type { CollectionConfig } from 'payload'

export const Sessions: CollectionConfig = {
  slug: 'sessions',
  admin: {
    useAsTitle: 'sessionId',
    defaultColumns: ['sessionId', 'user', 'status', 'startedAt', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      // Users can only read their own sessions
      if (user) {
        return {
          user: {
            equals: user.id,
          },
        }
      }
      return false
    },
    update: ({ req: { user } }) => {
      // Users can only update their own sessions
      if (user) {
        return {
          user: {
            equals: user.id,
          },
        }
      }
      return false
    },
    delete: ({ req: { user } }) => {
      // Users can only delete their own sessions
      if (user) {
        return {
          user: {
            equals: user.id,
          },
        }
      }
      return false
    },
    create: ({ req: { user } }) => {
      // Only logged in users can create sessions
      return Boolean(user)
    },
  },
  fields: [
    {
      name: 'sessionId',
      type: 'text',
      required: true,
      admin: {
        description: 'UUID for identifying this session across windows/tabs',
      },
      hooks: {
        beforeValidate: [
          ({ data, value }) => {
            // Generate a UUID if one isn't provided
            if (!value) {
              return `session_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'User this session belongs to',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Completed', value: 'completed' },
        { label: 'Expired', value: 'expired' },
      ],
      defaultValue: 'active',
      required: true,
    },
    {
      name: 'workspace',
      type: 'relationship',
      relationTo: 'workspaces',
      admin: {
        description: 'Workspace this session is operating in',
      },
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      admin: {
        description: 'Project this session is working on',
      },
    },
    {
      name: 'task',
      type: 'relationship',
      relationTo: 'tasks',
      admin: {
        description: 'Task this session is working on',
      },
    },
    {
      name: 'startedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        description: 'When this session started',
      },
    },
    {
      name: 'lastActiveAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        description: 'When this session was last active',
      },
    },
    {
      name: 'completedAt',
      type: 'date',
      admin: {
        description: 'When this session was completed',
      },
    },
    {
      name: 'totalDuration',
      type: 'number',
      min: 0,
      admin: {
        description: 'Total duration in minutes',
      },
    },
    {
      name: 'activeDuration',
      type: 'number',
      min: 0,
      admin: {
        description: 'Active work duration in minutes (excluding pauses)',
      },
    },
    {
      name: 'timeEntries',
      type: 'array',
      admin: {
        description: 'Time tracking entries within this session',
      },
      fields: [
        {
          name: 'startedAt',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
        },
        {
          name: 'endedAt',
          type: 'date',
        },
        {
          name: 'duration',
          type: 'number',
          min: 0,
          admin: {
            description: 'Duration in minutes',
          },
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Work', value: 'work' },
            { label: 'Break', value: 'break' },
            { label: 'Meeting', value: 'meeting' },
            { label: 'Planning', value: 'planning' },
            { label: 'Review', value: 'review' },
          ],
          defaultValue: 'work',
          required: true,
        },
        {
          name: 'task',
          type: 'relationship',
          relationTo: 'tasks',
          admin: {
            description: 'Associated task (if any)',
          },
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
    {
      name: 'recoveryPoints',
      type: 'array',
      admin: {
        description: 'Saved recovery points for this session',
      },
      fields: [
        {
          name: 'recoveryPointId',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          required: true,
        },
        {
          name: 'createdAt',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Auto', value: 'auto' },
            { label: 'Manual', value: 'manual' },
          ],
          defaultValue: 'auto',
          required: true,
        },
        {
          name: 'context',
          type: 'json',
          admin: {
            description: 'State context information for recovery',
          },
        },
      ],
    },
    {
      name: 'context',
      type: 'json',
      admin: {
        description: 'Current session context data',
      },
    },
    {
      name: 'lastError',
      type: 'group',
      admin: {
        description: 'Last error encountered in this session',
      },
      fields: [
        {
          name: 'message',
          type: 'text',
        },
        {
          name: 'stack',
          type: 'textarea',
        },
        {
          name: 'timestamp',
          type: 'date',
        },
        {
          name: 'recoveryPointCreated',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata about this session',
      },
    },
    {
      name: 'devices',
      type: 'array',
      admin: {
        description: 'Devices/browsers used in this session',
      },
      fields: [
        {
          name: 'windowId',
          type: 'text',
          required: true,
        },
        {
          name: 'userAgent',
          type: 'text',
        },
        {
          name: 'lastActiveAt',
          type: 'date',
        },
        {
          name: 'ipAddress',
          type: 'text',
        },
        {
          name: 'platform',
          type: 'text',
        },
      ],
    },
    {
      name: 'isArchived',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this session is archived',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        // Update lastActiveAt automatically
        data.lastActiveAt = new Date().toISOString()
        
        // If status is changing to "completed", calculate duration and set completedAt
        if (data.status === 'completed' && operation === 'update') {
          const existingDoc = await req.payload.findByID({
            collection: 'sessions',
            id: data.id,
          })
          
          if (existingDoc.status !== 'completed') {
            data.completedAt = new Date().toISOString()
            
            // Calculate total duration
            const startedAt = new Date(existingDoc.startedAt).getTime()
            const completedAt = new Date(data.completedAt).getTime()
            const durationMs = completedAt - startedAt
            data.totalDuration = Math.round(durationMs / (1000 * 60)) // Convert to minutes
            
            // Calculate active duration from time entries
            if (existingDoc.timeEntries && existingDoc.timeEntries.length > 0) {
              const activeDurationMinutes = existingDoc.timeEntries.reduce((total, entry) => {
                if (entry.type === 'work' && entry.duration) {
                  return total + entry.duration
                }
                return total
              }, 0)
              
              data.activeDuration = activeDurationMinutes
            }
          }
        }
        
        return data
      },
    ],
    afterRead: [
      ({ doc }) => {
        // Check if session has expired (inactive for more than 15 minutes)
        if (doc.status === 'active' && doc.lastActiveAt) {
          const lastActiveTime = new Date(doc.lastActiveAt).getTime()
          const currentTime = Date.now()
          const inactiveTime = currentTime - lastActiveTime
          
          // If inactive for more than 15 minutes (900000 ms), mark as expired in the response
          if (inactiveTime > 900000) {
            doc.status = 'expired'
          }
        }
        
        return doc
      },
    ],
  },
  timestamps: true,
}
