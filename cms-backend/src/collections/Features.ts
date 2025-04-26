import type { CollectionConfig } from 'payload'

export const Features: CollectionConfig = {
  slug: 'features',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'project', 'status', 'priority', 'createdAt', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      // Users can read features in projects/workspaces they are members of
      if (user) {
        return true // Further filtering will be done at the project/workspace level
      }
      return false
    },
    update: ({ req: { user } }) => {
      // Users can update features they are assigned to or in projects/workspaces where they have appropriate permissions
      if (user) {
        return true // Further filtering will be done at the project/workspace level
      }
      return false
    },
    delete: ({ req: { user } }) => {
      // Only project owners/admins can delete features
      if (user) {
        return true // Further filtering will be done at the project/workspace level
      }
      return false
    },
    create: ({ req: { user } }) => {
      // Only logged in users can create features
      return Boolean(user)
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Feature name or title',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Detailed description of the feature',
      },
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
      admin: {
        description: 'Project this feature belongs to',
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
        { label: 'Proposed', value: 'proposed' },
        { label: 'Approved', value: 'approved' },
        { label: 'In Development', value: 'in-development' },
        { label: 'In Review', value: 'in-review' },
        { label: 'Testing', value: 'testing' },
        { label: 'Done', value: 'done' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'proposed',
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
      name: 'assignees',
      type: 'array',
      admin: {
        description: 'Users assigned to this feature',
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
            { label: 'Owner', value: 'owner' },
            { label: 'Developer', value: 'developer' },
            { label: 'Reviewer', value: 'reviewer' },
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
      name: 'workflowDefinition',
      type: 'relationship',
      relationTo: 'workflow-definitions',
      admin: {
        description: 'Workflow definition used for this feature',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        description: 'When work on this feature should start',
      },
    },
    {
      name: 'targetDate',
      type: 'date',
      admin: {
        description: 'Target completion date',
      },
    },
    {
      name: 'completedDate',
      type: 'date',
      admin: {
        description: 'When this feature was completed',
      },
    },
    {
      name: 'estimatedDays',
      type: 'number',
      min: 0,
      admin: {
        description: 'Estimated days to complete',
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
      name: 'dependencies',
      type: 'array',
      admin: {
        description: 'Other features this feature depends on',
      },
      fields: [
        {
          name: 'feature',
          type: 'relationship',
          relationTo: 'features',
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
          name: 'strength',
          type: 'select',
          options: [
            { label: 'Weak', value: 'weak' },
            { label: 'Medium', value: 'medium' },
            { label: 'Strong', value: 'strong' },
          ],
          defaultValue: 'medium',
          required: true,
        },
        {
          name: 'notes',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'workItems',
      type: 'array',
      admin: {
        description: 'Work items that implement this feature',
      },
      fields: [
        {
          name: 'workItem',
          type: 'relationship',
          relationTo: 'work-items',
          required: true,
        },
        {
          name: 'addedAt',
          type: 'date',
          defaultValue: () => new Date().toISOString(),
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'attachments',
      type: 'array',
      admin: {
        description: 'Files attached to this feature',
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
        description: 'Comments on this feature',
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
      name: 'approvals',
      type: 'array',
      admin: {
        description: 'Approval records for this feature',
      },
      fields: [
        {
          name: 'transition',
          type: 'text',
          required: true,
          admin: {
            description: 'The status transition this approval is for',
          },
        },
        {
          name: 'approver',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Approved', value: 'approved' },
            { label: 'Rejected', value: 'rejected' },
          ],
          defaultValue: 'pending',
          required: true,
        },
        {
          name: 'requestedAt',
          type: 'date',
          defaultValue: () => new Date().toISOString(),
          required: true,
        },
        {
          name: 'respondedAt',
          type: 'date',
        },
        {
          name: 'comments',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'progress',
      type: 'number',
      min: 0,
      max: 100,
      admin: {
        description: 'Feature completion percentage',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata about this feature',
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
              collection: 'features',
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
              
              // If status is changing to "done", set completedDate
              if (data.status === 'done' && existingDoc.status !== 'done') {
                data.completedDate = new Date().toISOString()
              }
            }
          } catch (error) {
            console.error('Error fetching existing feature:', error)
          }
        }
        
        return data
      },
    ],
    afterChange: [
      async ({ req, doc, operation }) => {
        // After create or update, recalculate progress based on work items
        if (req.payload && doc.workItems && doc.workItems.length > 0) {
          const workItemIds = doc.workItems.map(wi => wi.workItem)
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
