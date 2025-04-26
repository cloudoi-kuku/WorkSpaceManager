import type { CollectionConfig } from 'payload'

export const Dependencies: CollectionConfig = {
  slug: 'dependencies',
  admin: {
    useAsTitle: 'description',
    defaultColumns: ['sourceType', 'sourceId', 'targetType', 'targetId', 'type', 'strength'],
  },
  access: {
    read: ({ req: { user } }) => {
      // Users can read dependencies for items they have access to
      if (user) {
        return true // Further filtering will be done at the related item level
      }
      return false
    },
    update: ({ req: { user } }) => {
      // Users can update dependencies for items they have permission to update
      if (user) {
        return true // Further filtering will be done at the related item level
      }
      return false
    },
    delete: ({ req: { user } }) => {
      // Users can delete dependencies for items they have permission to update
      if (user) {
        return true // Further filtering will be done at the related item level
      }
      return false
    },
    create: ({ req: { user } }) => {
      // Only logged in users can create dependencies
      return Boolean(user)
    },
  },
  fields: [
    {
      name: 'description',
      type: 'text',
      admin: {
        description: 'Description of this dependency relationship',
      },
    },
    {
      name: 'sourceType',
      type: 'select',
      options: [
        { label: 'Feature', value: 'feature' },
        { label: 'Work Item', value: 'work-item' },
        { label: 'Task', value: 'task' },
        { label: 'Project', value: 'project' },
      ],
      required: true,
      admin: {
        description: 'Type of the source item',
      },
    },
    {
      name: 'sourceId',
      type: 'text',
      required: true,
      admin: {
        description: 'ID of the source item',
      },
    },
    {
      name: 'targetType',
      type: 'select',
      options: [
        { label: 'Feature', value: 'feature' },
        { label: 'Work Item', value: 'work-item' },
        { label: 'Task', value: 'task' },
        { label: 'Project', value: 'project' },
      ],
      required: true,
      admin: {
        description: 'Type of the target item',
      },
    },
    {
      name: 'targetId',
      type: 'text',
      required: true,
      admin: {
        description: 'ID of the target item',
      },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Blocks', value: 'blocks' },
        { label: 'Requires', value: 'requires' },
        { label: 'Enhances', value: 'enhances' },
        { label: 'Related', value: 'related' },
        { label: 'Contains', value: 'contains' },
        { label: 'Implements', value: 'implements' },
        { label: 'Tests', value: 'tests' },
        { label: 'Duplicates', value: 'duplicates' },
      ],
      defaultValue: 'blocks',
      required: true,
      admin: {
        description: 'Type of dependency relationship',
      },
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
      admin: {
        description: 'Strength/importance of the dependency',
      },
    },
    {
      name: 'state',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Resolved', value: 'resolved' },
        { label: 'Ignored', value: 'ignored' },
      ],
      defaultValue: 'active',
      required: true,
    },
    {
      name: 'workspace',
      type: 'relationship',
      relationTo: 'workspaces',
      required: true,
      admin: {
        description: 'Workspace this dependency belongs to',
      },
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      admin: {
        description: 'Project this dependency belongs to',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes about this dependency',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ req, value }) => {
            if (req.user && req.user.id && !value) {
              return req.user.id
            }
            return value
          },
        ],
      },
    },
    {
      name: 'resolvedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'User who resolved this dependency',
        condition: (data) => data.state === 'resolved',
      },
    },
    {
      name: 'resolvedAt',
      type: 'date',
      admin: {
        description: 'When this dependency was resolved',
        condition: (data) => data.state === 'resolved',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata about this dependency',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        // If state is changing to "resolved", set resolvedAt and resolvedBy
        if (operation === 'update' && data.state === 'resolved') {
          const existingDoc = await req.payload.findByID({
            collection: 'dependencies',
            id: data.id,
          })
          
          if (existingDoc.state !== 'resolved') {
            data.resolvedAt = new Date().toISOString()
            data.resolvedBy = req.user.id
          }
        }
        
        return data
      },
    ],
    afterChange: [
      async ({ req, doc, operation }) => {
        // After dependency is created or updated, update the source and target items
        if (req.payload && (operation === 'create' || operation === 'update')) {
          try {
            // Update source item
            if (doc.sourceType && doc.sourceId) {
              const sourceItem = await req.payload.findByID({
                collection: doc.sourceType === 'work-item' ? 'work-items' : doc.sourceType + 's',
                id: doc.sourceId,
              })
              
              if (sourceItem) {
                // You might want to update the source item to reflect this dependency
                // This is a placeholder for custom logic that might be needed
              }
            }
            
            // Update target item
            if (doc.targetType && doc.targetId) {
              const targetItem = await req.payload.findByID({
                collection: doc.targetType === 'work-item' ? 'work-items' : doc.targetType + 's',
                id: doc.targetId,
              })
              
              if (targetItem) {
                // You might want to update the target item to reflect this dependency
                // This is a placeholder for custom logic that might be needed
              }
            }
          } catch (error) {
            console.error('Error updating dependency-related items:', error)
          }
        }
      },
    ],
  },
  timestamps: true,
}
