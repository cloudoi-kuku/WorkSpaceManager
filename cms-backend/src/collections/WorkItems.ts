import type { CollectionConfig } from 'payload'

export const WorkItems: CollectionConfig = {
  slug: 'work-items',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'feature', 'status', 'assignee', 'createdAt', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      // Users can read work items they are assigned to or in projects/workspaces they are members of
      if (user) {
        return true // Further filtering will be done at the feature/project/workspace level
      }
      return false
    },
    update: ({ req: { user } }) => {
      // Users can update work items they are assigned to or in projects/workspaces where they have appropriate permissions
      if (user) {
        return true // Further filtering will be done at the feature/project/workspace level
      }
      return false
    },
    delete: ({ req: { user } }) => {
      // Only project owners/admins can delete work items
      if (user) {
        return true // Further filtering will be done at the feature/project/workspace level
      }
      return false
    },
    create: ({ req: { user } }) => {
      // Only logged in users can create work items
      return Boolean(user)
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Work item name or title',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Detailed description of the work item',
      },
    },
    {
      name: 'feature',
      type: 'relationship',
      relationTo: 'features',
      required: true,
      admin: {
        description: 'Feature this work item belongs to',
      },
      hooks: {
        afterRead: [
          async ({ value, req, data }) => {
            // Load project and workspace information for UI display
            if (value && req.payload) {
              try {
                const feature = await req.payload.findByID({
                  collection: 'features',
                  id: value,
                })
                
                if (feature && feature.project) {
                  data.project = feature.project
                  
                  const project = await req.payload.findByID({
                    collection: 'projects',
                    id: feature.project,
                  })
                  
                  if (project && project.workspace) {
                    data.workspace = project.workspace
                  }
                }
              } catch (error) {
                console.error('Error fetching feature/project/workspace:', error)
              }
            }
            return value
          },
        ],
      },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Task', value: 'task' },
        { label: 'Bug', value: 'bug' },
        { label: 'Documentation', value: 'documentation' },
        { label: 'Test', value: 'test' },
        { label: 'Refactor', value: 'refactor' },
        { label: 'Enhancement', value: 'enhancement' },
      ],
      defaultValue: 'task',
      required: true,
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
        description: 'User assigned to this work item',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        description: 'When work on this item should start',
      },
    },
    {
      name: 'dueDate',
      type: 'date',
      admin: {
        description: 'When this work item is due',
      },
    },
    {
      name: 'completedDate',
      type: 'date',
      admin: {
        description: 'When this work item was completed',
      },
    },
    {
      name: 'estimatedHours',
      type: 'number',
      min: 0,
      admin: {
        description: 'Estimated hours to complete',
      },
    },
    {
      name: 'actualHours',
      type: 'number',
      min: 0,
      admin: {
        description: 'Actual hours spent on this item',
      },
    },
    {
      name: 'dependencies',
      type: 'array',
      admin: {
        description: 'Other work items this item depends on',
      },
      fields: [
        {
          name: 'workItem',
          type: 'relationship',
          relationTo: 'work-items',
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
        {
          name: 'notes',
          type: 'textarea',
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
      name: 'attachments',
      type: 'array',
      admin: {
        description: 'Files attached to this work item',
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
        description: 'Comments on this work item',
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
        description: 'Time tracking entries for this work item',
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
    {
      name: 'statusHistory',
      type: 'array',
      admin: {
        description: 'History of status changes',
        readOnly: true,
      },
      fields: [
        {
          name: 'from',
          type: 'text',
          required: true,
        },
        {
          name: 'to',
          type: 'text',
          required: true,
        },
        {
          name: 'changedBy',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'changedAt',
          type: 'date',
          defaultValue: () => new Date().toISOString(),
          required: true,
        },
        {
          name: 'reason',
          type: 'text',
        },
      ],
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata about this work item',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        // Track status changes
        if (operation === 'update' && data.id) {
          try {
            const existingDoc = await req.payload.findByID({
              collection: 'work-items',
              id: data.id,
            })
            
            // If status is changing, add to statusHistory
            if (existingDoc.status !== data.status) {
              if (!data.statusHistory) {
                data.statusHistory = []
              }
              
              data.statusHistory.push({
                from: existingDoc.status,
                to: data.status,
                changedBy: req.user.id,
                changedAt: new Date().toISOString(),
              })
              
              // If status is changing to "completed", set completedDate
              if (data.status === 'completed' && existingDoc.status !== 'completed') {
                data.completedDate = new Date().toISOString()
              }
            }
          } catch (error) {
            console.error('Error fetching existing work item:', error)
          }
        }
        
        return data
      },
    ],
    afterChange: [
      async ({ req, doc, operation }) => {
        // After work item is updated, update feature progress
        if (req.payload && doc.feature) {
          try {
            const feature = await req.payload.findByID({
              collection: 'features',
              id: doc.feature,
            })
            
            if (feature && feature.workItems && feature.workItems.length > 0) {
              const workItemIds = feature.workItems.map(wi => wi.workItem)
              
              const workItems = await req.payload.find({
                collection: 'work-items',
                where: {
                  id: {
                    in: workItemIds,
                  },
                },
              })
              
              if (workItems.docs.length > 0) {
                // Calculate progress based on completed work items
                const completedItems = workItems.docs.filter(item => item.status === 'completed')
                const progressPercentage = Math.round((completedItems.length / workItems.docs.length) * 100)
                
                // Update feature progress
                await req.payload.update({
                  collection: 'features',
                  id: doc.feature,
                  data: {
                    progress: progressPercentage,
                  },
                })
              }
            }
          } catch (error) {
            console.error('Error updating feature progress:', error)
          }
        }
      },
    ],
  },
  timestamps: true,
}
