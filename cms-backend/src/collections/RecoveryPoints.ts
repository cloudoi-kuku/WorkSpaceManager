import type { CollectionConfig } from 'payload'

export const RecoveryPoints: CollectionConfig = {
  slug: 'recovery-points',
  admin: {
    useAsTitle: 'description',
    defaultColumns: ['description', 'user', 'type', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      // Users can only read their own recovery points
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
      // Users can only update their own recovery points
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
      // Users can only delete their own recovery points
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
      // Only logged in users can create recovery points
      return Boolean(user)
    },
  },
  fields: [
    {
      name: 'recoveryPointId',
      type: 'text',
      required: true,
      admin: {
        description: 'UUID for this recovery point',
      },
      hooks: {
        beforeValidate: [
          ({ data, value }) => {
            // Generate a UUID if one isn't provided
            if (!value) {
              return `rp_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      admin: {
        description: 'Description of this recovery point',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'User this recovery point belongs to',
      },
    },
    {
      name: 'session',
      type: 'relationship',
      relationTo: 'sessions',
      admin: {
        description: 'Session this recovery point is associated with',
      },
    },
    {
      name: 'workspace',
      type: 'relationship',
      relationTo: 'workspaces',
      admin: {
        description: 'Workspace at the time of recovery point creation',
      },
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      admin: {
        description: 'Project at the time of recovery point creation',
      },
    },
    {
      name: 'feature',
      type: 'relationship',
      relationTo: 'features',
      admin: {
        description: 'Feature at the time of recovery point creation',
      },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Auto', value: 'auto' },
        { label: 'Manual', value: 'manual' },
        { label: 'Error', value: 'error' },
        { label: 'System', value: 'system' },
      ],
      defaultValue: 'manual',
      required: true,
    },
    {
      name: 'state',
      type: 'json',
      required: true,
      admin: {
        description: 'Saved state data for recovery',
      },
    },
    {
      name: 'thumbnailImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional thumbnail of the workspace state',
      },
    },
    {
      name: 'deviceInfo',
      type: 'group',
      admin: {
        description: 'Information about the device that created this recovery point',
      },
      fields: [
        {
          name: 'userAgent',
          type: 'text',
        },
        {
          name: 'platform',
          type: 'text',
        },
        {
          name: 'windowId',
          type: 'text',
        },
        {
          name: 'ipAddress',
          type: 'text',
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata about this recovery point',
      },
    },
    {
      name: 'isArchived',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this recovery point is archived',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        description: 'When this recovery point should expire',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        // Set expiration date for auto recovery points if not set (14 days by default)
        if (data.type === 'auto' && !data.expiresAt) {
          const expirationDate = new Date()
          expirationDate.setDate(expirationDate.getDate() + 14)
          data.expiresAt = expirationDate.toISOString()
        }
        
        return data
      },
    ],
  },
  timestamps: true,
}
