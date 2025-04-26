import type { CollectionConfig } from 'payload'

export const AIConversations: CollectionConfig = {
  slug: 'ai-conversations',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'user', 'createdAt', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      // Users can only read their own conversations
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
      // Users can only update their own conversations
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
      // Users can only delete their own conversations
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
      // Only logged in users can create conversations
      return Boolean(user)
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Title of this conversation',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'User this conversation belongs to',
      },
    },
    {
      name: 'workspace',
      type: 'relationship',
      relationTo: 'workspaces',
      admin: {
        description: 'Workspace this conversation is related to',
      },
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      admin: {
        description: 'Project this conversation is related to',
      },
    },
    {
      name: 'feature',
      type: 'relationship',
      relationTo: 'features',
      admin: {
        description: 'Feature this conversation is related to',
      },
    },
    {
      name: 'workItem',
      type: 'relationship',
      relationTo: 'work-items',
      admin: {
        description: 'Work item this conversation is related to',
      },
    },
    {
      name: 'modelName',
      type: 'select',
      options: [
        { label: 'DeepSeek Coder', value: 'deepseek-coder' },
        { label: 'Llama 3', value: 'llama3' },
        { label: 'Mistral', value: 'mistral' },
        { label: 'CodeLlama', value: 'codellama' },
        { label: 'Gemma', value: 'gemma' },
        { label: 'Custom', value: 'custom' },
      ],
      defaultValue: 'deepseek-coder',
      required: true,
    },
    {
      name: 'customModelName',
      type: 'text',
      admin: {
        description: 'Name of custom model',
        condition: (data) => data.modelName === 'custom',
      },
    },
    {
      name: 'messages',
      type: 'array',
      required: true,
      admin: {
        description: 'Messages in this conversation',
      },
      fields: [
        {
          name: 'role',
          type: 'select',
          options: [
            { label: 'User', value: 'user' },
            { label: 'Assistant', value: 'assistant' },
            { label: 'System', value: 'system' },
          ],
          defaultValue: 'user',
          required: true,
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
        },
        {
          name: 'timestamp',
          type: 'date',
          defaultValue: () => new Date().toISOString(),
          required: true,
        },
        {
          name: 'metadata',
          type: 'json',
          admin: {
            description: 'Additional metadata for this message',
          },
        },
      ],
    },
    {
      name: 'contextFiles',
      type: 'array',
      admin: {
        description: 'Files included in the context for this conversation',
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
        {
          name: 'addedAt',
          type: 'date',
          defaultValue: () => new Date().toISOString(),
          required: true,
        },
      ],
    },
    {
      name: 'generatedFiles',
      type: 'array',
      admin: {
        description: 'Files generated during this conversation',
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
        {
          name: 'generatedAt',
          type: 'date',
          defaultValue: () => new Date().toISOString(),
          required: true,
        },
        {
          name: 'associatedMessage',
          type: 'number',
          admin: {
            description: 'Index of the message that generated this file',
          },
        },
      ],
    },
    {
      name: 'systemPrompt',
      type: 'textarea',
      admin: {
        description: 'System prompt used for this conversation',
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
      name: 'parameters',
      type: 'json',
      admin: {
        description: 'Model parameters used for this conversation',
      },
    },
    {
      name: 'favorites',
      type: 'array',
      admin: {
        description: 'Favorite messages in this conversation',
      },
      fields: [
        {
          name: 'messageIndex',
          type: 'number',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
        {
          name: 'addedAt',
          type: 'date',
          defaultValue: () => new Date().toISOString(),
          required: true,
        },
      ],
    },
    {
      name: 'isArchived',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this conversation is archived',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata about this conversation',
      },
    },
  ],
  timestamps: true,
}
