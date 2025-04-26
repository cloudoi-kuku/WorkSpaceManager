import type { CollectionConfig } from 'payload'

export const Tasks: CollectionConfig = {
  slug: 'tasks',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'project', 'status', 'assignee', 'priority', 'dueDate'],
  },
  access: {
    read: ({ req: { user } }) => {
      // Users can read tasks they are assigned to or in projects/workspaces they are members of
      if (user) {
        return true // Further filtering will be done at the project/workspace level
      }
      return false
    },
    update: ({ req: { user } }) => {
      // Users can update tasks they are assigned to or in projects/workspaces where they have appropriate permissions
      if (user) {
        return true // Further filtering will be done at the project/workspace level
      }
      return false
    },
    delete: ({ req: { user } }) => {
      // Only project owners/admins can delete tasks
      if (user) {
        return true // Further filtering will be done at the project/workspace level
      }
      return false
    },
    create: ({ req: { user } }) => {
      // Only logged in users can create tasks
      return Boolean(user)
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Detailed description of the task',
      },
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
      admin: {
        description: 'Project this task belongs to',
      },
      hooks: {
        afterRead: [
          async ({ value, req, data }) => {
            // Load workspace information for UI display
            if (value && req.payload) {
              try {
                const project = await req.payload.findByID({
                  collection: 'projects',
                  id: value,
                })
                
                if (project && project.workspace) {
                  data.workspace = project.workspace
                }
              } catch (error) {
                console.error('Error fetching project workspace:', error)
              }
            }
            return value
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'To Do', value: 'todo' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'In Review', value: 'in-review' },
        { label: 'Blocked', value: 'blocked' },
        { label: 'Completed', value: 'completed' },
      ],
      defaultValue: 'todo',
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
      name: 'assignee',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'User assigned to this task',
      },
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
      name: 'estimatedHours',
      type: 'number',
      min: 0,
      admin: {
        description: 'Estimated hours to complete this task',
      },
    },
    {
      name: 'actualHours',
      type: 'number',
      min: 0,
      admin: {
        description: 'Actual hours spent on this task',
      },
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
      name: 'parentTask',
      type: 'relationship',
      relationTo: 'tasks',
      admin: {
        description: 'Parent task if this is a subtask',
      },
    },
    {
      name: 'dependencies',
      type: 'array',
      admin: {
        description: 'Tasks that must be completed before this task can start',
      },
      fields: [
        {
          name: 'task',
          type: 'relationship',
          relationTo: 'tasks',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Blocks', value: 'blocks' },
            { label: 'Requires', value: 'requires' },
            { label: 'Related', value: 'related' },
          ],
          defaultValue: 'blocks',
          required: true,
        },
      ],
    },
    {
      name: 'attachments',
      type: 'array',
      admin: {
        description: 'Files attached to this task',
      },
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
    {
      name: 'comments',
      type: 'array',
      admin: {
        description: 'Comments on this task',
      },
      fields: [
        {
          name: 'author',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
        },
        {
          name: 'createdAt',
          type: 'date',
          defaultValue: () => new Date().toISOString(),
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'updatedAt',
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'githubIssue',
      type: 'group',
      admin: {
        description: 'GitHub issue details if connected',
      },
      fields: [
        {
          name: 'owner',
          type: 'text',
        },
        {
          name: 'repo',
          type: 'text',
        },
        {
          name: 'issueNumber',
          type: 'number',
        },
        {
          name: 'issueUrl',
          type: 'text',
        },
        {
          name: 'lastSyncedAt',
          type: 'date',
        },
      ],
    },
    {
      name: 'timeTracking',
      type: 'array',
      admin: {
        description: 'Time tracking entries for this task',
      },
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'startedAt',
          type: 'date',
          required: true,
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
          name: 'description',
          type: 'text',
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        // If status is changing to "completed", set completedDate
        if (operation === 'update' && data.status === 'completed') {
          const existingDoc = await req.payload.findByID({
            collection: 'tasks',
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
        // After task is updated, update project progress
        if (req.payload && doc.project) {
          const tasks = await req.payload.find({
            collection: 'tasks',
            where: {
              project: {
                equals: doc.project,
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
              id: doc.project,
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
