import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'role'],
  },
  auth: true,
  access: {
    read: ({ req: { user } }) => {
      // Anyone can read their own document
      if (user) {
        return true
      }
      // Otherwise, only admins or with proper permissions
      return {
        role: {
          in: ['admin'],
        },
      }
    },
    update: ({ req: { user } }) => {
      // Users can update their own document
      if (user) {
        return {
          id: {
            equals: user.id,
          },
        }
      }
      // Otherwise, only admins
      return {
        role: {
          equals: 'admin',
        },
      }
    },
    delete: ({ req: { user } }) => {
      // Only admins can delete users
      if (user && user.role === 'admin') {
        return true
      }
      return false
    },
  },
  fields: [
    // Email added by default
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      defaultValue: 'user',
      required: true,
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'lastLogin',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'preferences',
      type: 'json',
      admin: {
        description: 'User preferences and settings',
      },
    },
    {
      name: 'githubToken',
      type: 'text',
      admin: {
        description: 'GitHub OAuth token for integration',
        position: 'sidebar',
        condition: ({ role }) => role === 'admin',
      },
      access: {
        read: ({ req: { user } }) => {
          // Users can only read their own token
          if (user) {
            return {
              id: {
                equals: user.id,
              },
            }
          }
          return false
        },
        update: ({ req: { user } }) => {
          // Users can only update their own token
          if (user) {
            return {
              id: {
                equals: user.id,
              },
            }
          }
          return false
        },
      },
    },
  ],
  hooks: {
    beforeLogin: [
      // @ts-ignore - Payload types are not correctly defined for beforeLogin hook
      async ({ req, user }) => {
        // Update last login time
        if (req.payload && user && user.email) {
          try {
            await req.payload.update({
              collection: 'users',
              id: user.id,
              data: {
                lastLogin: new Date().toISOString(),
              },
            });
          } catch (error) {
            console.error('Error in beforeLogin hook:', error);
            // Don't throw the error, just log it
            // This allows the login process to continue
          }
        }
      },
    ],
  },
}
