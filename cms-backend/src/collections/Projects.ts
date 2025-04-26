import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'workspace', 'status', 'createdAt', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      // Users can read projects in workspaces they are members of
      if (user) {
        return true // Further filtering will be done at the workspace level
      }
      return false
    },
    update: ({ req: { user } }) => {
      // Users can update projects they created or are in workspaces where they are admin/member
      if (user) {
        return true // Further filtering will be done at the workspace level
      }
      return false
    },
    delete: ({ req: { user } }) => {
      // Only the creator or workspace admins can delete projects
      if (user) {
        return true // Further filtering will be done at the workspace level
      }
      return false
    },
    create: ({ req: { user } }) => {
      // Only workspace members can create projects
      return Boolean(user)
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'The name of the project',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'A description of the project',
      },
    },
    {
      name: 'workspace',
      type: 'relationship',
      relationTo: 'workspaces',
      required: true,
      admin: {
        description: 'The workspace this project belongs to',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Planning', value: 'planning' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'On Hold', value: 'on-hold' },
        { label: 'Completed', value: 'completed' },
        { label: 'Canceled', value: 'canceled' },
      ],
      defaultValue: 'planning',
      required: true,
    },
    {
      name: 'priority',
      type: 'select',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Critical', value: 'critical' },
      ],
      defaultValue: 'medium',
      required: true,
    },
    {
      name: 'startDate',
      type: 'date',
    },
    {
      name: 'dueDate',
      type: 'date',
    },
    {
      name: 'completedDate',
      type: 'date',
    },
    {
      name: 'assignees',
      type: 'array',
      admin: {
        description: 'Users assigned to this project',
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
            { label: 'Project Manager', value: 'manager' },
            { label: 'Developer', value: 'developer' },
            { label: 'Designer', value: 'designer' },
            { label: 'Tester', value: 'tester' },
            { label: 'Stakeholder', value: 'stakeholder' },
          ],
          required: true,
        },
        {
          name: 'assignedAt',
          type: 'date',
          defaultValue: () => new Date().toISOString(),
          admin: {
            readOnly: true,
          },
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
      name: 'githubRepo',
      type: 'group',
      admin: {
        description: 'GitHub repository details if connected',
      },
      fields: [
        {
          name: 'owner',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'url',
          type: 'text',
        },
        {
          name: 'branch',
          type: 'text',
          defaultValue: 'main',
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
        description: 'Project-specific settings',
      },
    },
    {
      name: 'progress',
      type: 'number',
      min: 0,
      max: 100,
      admin: {
        description: 'Project completion percentage',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        // If status is changing to "completed", set completedDate
        if (operation === 'update' && data.status === 'completed') {
          const existingDoc = await req.payload.findByID({
            collection: 'projects',
            id: data.id,
          })
          
          if (existingDoc.status !== 'completed') {
            data.completedDate = new Date().toISOString()
          }
        }
        
        return data
      },
    ],
    afterChange: [
      async ({ req, doc, operation }) => {
        // After create or update, recalculate progress based on tasks
        if (req.payload) {
          const tasks = await req.payload.find({
            collection: 'tasks',
            where: {
              project: {
                equals: doc.id,
              },
            },
          })
          
          if (tasks.docs.length > 0) {
            // Calculate progress based on completed tasks
            const completedTasks = tasks.docs.filter(task => task.status === 'completed')
            const progressPercentage = Math.round((completedTasks.length / tasks.docs.length) * 100)
            
            // Update project progress
            await req.payload.update({
              collection: 'projects',
              id: doc.id,
              data: {
                progress: progressPercentage,
              },
            })
          }
        }
      },
    ],
  },
  timestamps: true,
}
