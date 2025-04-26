import type { CollectionConfig } from 'payload'

export const Workspaces: CollectionConfig = {
  slug: 'workspaces',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'createdBy', 'createdAt', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      // If user is logged in, they can read workspaces they are a member of
      if (user) {
        return {
          or: [
            {
              'createdBy.id': {
                equals: user.id,
              },
            },
            {
              members: {
                some: {
                  user: {
                    equals: user.id,
                  },
                },
              },
            },
          ],
        }
      }
      return false
    },
    update: ({ req: { user } }) => {
      // If user is logged in, they can update workspaces they own or are an admin of
      if (user) {
        return {
          or: [
            {
              'createdBy.id': {
                equals: user.id,
              },
            },
            {
              members: {
                some: {
                  user: {
                    equals: user.id,
                  },
                  role: {
                    equals: 'admin',
                  },
                },
              },
            },
          ],
        }
      }
      return false
    },
    delete: ({ req: { user } }) => {
      // Only the creator or admin members can delete workspaces
      if (user) {
        return {
          or: [
            {
              'createdBy.id': {
                equals: user.id,
              },
            },
            {
              members: {
                some: {
                  user: {
                    equals: user.id,
                  },
                  role: {
                    equals: 'admin',
                  },
                },
              },
            },
          ],
        }
      }
      return false
    },
    create: ({ req: { user } }) => {
      // Only logged in users can create workspaces
      return Boolean(user)
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'The name of the workspace',
      },
    },
    {
      name: 'description',
      type: 'json',
      admin: {
        description: 'A description of the workspace',
      },
    },
    {
      name: 'members',
      type: 'array',
      admin: {
        description: 'Members of this workspace',
      },
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
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
              label: 'Member',
              value: 'member',
            },
            {
              label: 'Viewer',
              value: 'viewer',
            },
          ],
          defaultValue: 'member',
          required: true,
        },
        {
          name: 'joinedAt',
          type: 'date',
          defaultValue: () => new Date().toISOString(),
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'icon',
      type: 'select',
      options: [
        { label: 'Briefcase', value: 'briefcase' },
        { label: 'Code', value: 'code' },
        { label: 'Document', value: 'document' },
        { label: 'Globe', value: 'globe' },
        { label: 'Home', value: 'home' },
        { label: 'Lightning', value: 'lightning' },
        { label: 'People', value: 'people' },
        { label: 'Project', value: 'project' },
        { label: 'Star', value: 'star' },
      ],
      defaultValue: 'briefcase',
    },
    {
      name: 'color',
      type: 'select',
      options: [
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
        { label: 'Red', value: 'red' },
        { label: 'Purple', value: 'purple' },
        { label: 'Orange', value: 'orange' },
        { label: 'Pink', value: 'pink' },
        { label: 'Cyan', value: 'cyan' },
        { label: 'Yellow', value: 'yellow' },
        { label: 'Gray', value: 'gray' },
      ],
      defaultValue: 'blue',
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this workspace is visible to non-members',
      },
    },
    {
      name: 'githubRepositories',
      type: 'array',
      admin: {
        description: 'GitHub repositories connected to this workspace',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'owner',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
        },
        {
          name: 'syncEnabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'lastSyncedAt',
          type: 'date',
        },
      ],
    },
    {
      name: 'settings',
      type: 'json',
      admin: {
        description: 'Custom settings for this workspace',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, data }) => {
        // Add the creating user as the first member with admin role if this is a new workspace
        if (req.user && !data.id) {
          // Check if members array exists
          if (!data.members) {
            data.members = []
          }

          // Add the current user as a member with admin role if not already present
          const currentUserIsMember = data.members.some(
            (member: any) => member.user === req.user.id || member.user.id === req.user.id
          )

          if (!currentUserIsMember) {
            data.members.push({
              user: req.user.id,
              role: 'admin',
              joinedAt: new Date().toISOString(),
            })
          }
        }

        return data
      },
    ],
  },
  timestamps: true,
}
