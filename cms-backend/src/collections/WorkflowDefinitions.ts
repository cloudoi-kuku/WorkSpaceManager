import type { CollectionConfig } from 'payload'

export const WorkflowDefinitions: CollectionConfig = {
  slug: 'workflow-definitions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'workspace', 'createdBy', 'createdAt', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      // Users can read workflow definitions in workspaces they are members of
      if (user) {
        return true // Further filtering will be done at the workspace level
      }
      return false
    },
    update: ({ req: { user } }) => {
      // Only admins or owners can update workflow definitions
      if (user) {
        return true // Further filtering will be done at the workspace level
      }
      return false
    },
    delete: ({ req: { user } }) => {
      // Only admins or owners can delete workflow definitions
      if (user) {
        return true // Further filtering will be done at the workspace level
      }
      return false
    },
    create: ({ req: { user } }) => {
      // Only logged in users can create workflow definitions
      return Boolean(user)
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the workflow definition',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Description of the workflow and its purpose',
      },
    },
    {
      name: 'workspace',
      type: 'relationship',
      relationTo: 'workspaces',
      required: true,
      admin: {
        description: 'Workspace this workflow definition belongs to',
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this is the default workflow for the workspace',
      },
    },
    {
      name: 'stages',
      type: 'array',
      required: true,
      minRows: 2,
      admin: {
        description: 'Stages in this workflow',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'color',
          type: 'select',
          options: [
            { label: 'Gray', value: 'gray' },
            { label: 'Blue', value: 'blue' },
            { label: 'Green', value: 'green' },
            { label: 'Yellow', value: 'yellow' },
            { label: 'Orange', value: 'orange' },
            { label: 'Red', value: 'red' },
            { label: 'Purple', value: 'purple' },
            { label: 'Pink', value: 'pink' },
            { label: 'Cyan', value: 'cyan' },
          ],
          defaultValue: 'blue',
          required: true,
        },
        {
          name: 'order',
          type: 'number',
          required: true,
          admin: {
            description: 'Order of this stage in the workflow (lower numbers come first)',
          },
        },
        {
          name: 'requiresApproval',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Whether transitioning to this stage requires approval',
          },
        },
        {
          name: 'defaultAssignees',
          type: 'array',
          admin: {
            description: 'Default assignees for items in this stage',
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
                { label: 'Assignee', value: 'assignee' },
                { label: 'Reviewer', value: 'reviewer' },
                { label: 'Approver', value: 'approver' },
              ],
              defaultValue: 'assignee',
              required: true,
            },
          ],
        },
        {
          name: 'customFields',
          type: 'array',
          admin: {
            description: 'Custom fields required in this stage',
          },
          fields: [
            {
              name: 'fieldName',
              type: 'text',
              required: true,
            },
            {
              name: 'fieldType',
              type: 'select',
              options: [
                { label: 'Text', value: 'text' },
                { label: 'Number', value: 'number' },
                { label: 'Date', value: 'date' },
                { label: 'Checkbox', value: 'checkbox' },
                { label: 'Select', value: 'select' },
              ],
              defaultValue: 'text',
              required: true,
            },
            {
              name: 'isRequired',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'options',
              type: 'array',
              admin: {
                description: 'Options for select field type',
                condition: (data, siblingData) => siblingData.fieldType === 'select',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'transitionRules',
      type: 'array',
      admin: {
        description: 'Rules for transitioning between stages',
      },
      fields: [
        {
          name: 'fromStage',
          type: 'number',
          required: true,
          admin: {
            description: 'Index of the from stage in the stages array',
          },
        },
        {
          name: 'toStage',
          type: 'number',
          required: true,
          admin: {
            description: 'Index of the to stage in the stages array',
          },
        },
        {
          name: 'condition',
          type: 'select',
          options: [
            { label: 'Always Allow', value: 'always' },
            { label: 'Require Approval', value: 'require-approval' },
            { label: 'Only Assignee', value: 'only-assignee' },
            { label: 'Only Creator', value: 'only-creator' },
            { label: 'Only Admin', value: 'only-admin' },
            { label: 'Custom', value: 'custom' },
          ],
          defaultValue: 'always',
          required: true,
        },
        {
          name: 'approvers',
          type: 'array',
          admin: {
            description: 'Users who can approve this transition',
            condition: (data, siblingData) => siblingData.condition === 'require-approval',
          },
          fields: [
            {
              name: 'user',
              type: 'relationship',
              relationTo: 'users',
              required: true,
            },
          ],
        },
        {
          name: 'requiredFields',
          type: 'array',
          admin: {
            description: 'Fields that must be completed before this transition is allowed',
          },
          fields: [
            {
              name: 'fieldName',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'customRule',
          type: 'code',
          admin: {
            description: 'Custom transition rule logic (JavaScript)',
            condition: (data, siblingData) => siblingData.condition === 'custom',
          },
        },
      ],
    },
    {
      name: 'automations',
      type: 'array',
      admin: {
        description: 'Automated actions that occur during transitions',
      },
      fields: [
        {
          name: 'triggerStage',
          type: 'number',
          admin: {
            description: 'Stage index that triggers this automation',
          },
        },
        {
          name: 'triggerType',
          type: 'select',
          options: [
            { label: 'On Enter Stage', value: 'enter' },
            { label: 'On Exit Stage', value: 'exit' },
            { label: 'On Time in Stage', value: 'time' },
          ],
          defaultValue: 'enter',
          required: true,
        },
        {
          name: 'timeCondition',
          type: 'group',
          admin: {
            description: 'Time-based trigger condition',
            condition: (data, siblingData) => siblingData.triggerType === 'time',
          },
          fields: [
            {
              name: 'amount',
              type: 'number',
              required: true,
              min: 1,
              admin: {
                description: 'Amount of time',
              },
            },
            {
              name: 'unit',
              type: 'select',
              options: [
                { label: 'Minutes', value: 'minutes' },
                { label: 'Hours', value: 'hours' },
                { label: 'Days', value: 'days' },
                { label: 'Weeks', value: 'weeks' },
              ],
              defaultValue: 'days',
              required: true,
            },
          ],
        },
        {
          name: 'actionType',
          type: 'select',
          options: [
            { label: 'Assign User', value: 'assign' },
            { label: 'Send Notification', value: 'notify' },
            { label: 'Change Priority', value: 'priority' },
            { label: 'Add Comment', value: 'comment' },
            { label: 'Move to Stage', value: 'move' },
            { label: 'Custom Action', value: 'custom' },
          ],
          required: true,
        },
        {
          name: 'assignUser',
          type: 'relationship',
          relationTo: 'users',
          admin: {
            description: 'User to assign',
            condition: (data, siblingData) => siblingData.actionType === 'assign',
          },
        },
        {
          name: 'notificationTemplate',
          type: 'textarea',
          admin: {
            description: 'Template for the notification',
            condition: (data, siblingData) => siblingData.actionType === 'notify',
          },
        },
        {
          name: 'notificationRecipients',
          type: 'select',
          options: [
            { label: 'Assignee', value: 'assignee' },
            { label: 'Creator', value: 'creator' },
            { label: 'All Team Members', value: 'team' },
            { label: 'Specific Users', value: 'specific' },
          ],
          admin: {
            condition: (data, siblingData) => siblingData.actionType === 'notify',
          },
        },
        {
          name: 'specificRecipients',
          type: 'array',
          admin: {
            description: 'Specific users to notify',
            condition: (data, siblingData) => 
              siblingData.actionType === 'notify' && siblingData.notificationRecipients === 'specific',
          },
          fields: [
            {
              name: 'user',
              type: 'relationship',
              relationTo: 'users',
              required: true,
            },
          ],
        },
        {
          name: 'priorityValue',
          type: 'select',
          options: [
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
            { label: 'Critical', value: 'critical' },
          ],
          admin: {
            description: 'New priority value',
            condition: (data, siblingData) => siblingData.actionType === 'priority',
          },
        },
        {
          name: 'commentText',
          type: 'textarea',
          admin: {
            description: 'Comment text to add',
            condition: (data, siblingData) => siblingData.actionType === 'comment',
          },
        },
        {
          name: 'targetStage',
          type: 'number',
          admin: {
            description: 'Stage to move to',
            condition: (data, siblingData) => siblingData.actionType === 'move',
          },
        },
        {
          name: 'customActionCode',
          type: 'code',
          admin: {
            description: 'Custom action code (JavaScript)',
            condition: (data, siblingData) => siblingData.actionType === 'custom',
          },
        },
      ],
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata for this workflow definition',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        // If this is being set as the default workflow, unset any other defaults
        if (data.isDefault && data.workspace) {
          try {
            // Find any existing default workflows
            const existingDefaults = await req.payload.find({
              collection: 'workflow-definitions',
              where: {
                and: [
                  {
                    workspace: {
                      equals: data.workspace,
                    },
                  },
                  {
                    isDefault: {
                      equals: true,
                    },
                  },
                  {
                    id: {
                      not_equals: data.id || 'new-document',
                    },
                  },
                ],
              },
            })
            
            // Unset the isDefault flag on any existing defaults
            for (const workflow of existingDefaults.docs) {
              await req.payload.update({
                collection: 'workflow-definitions',
                id: workflow.id,
                data: {
                  isDefault: false,
                },
              })
            }
          } catch (error) {
            console.error('Error updating default workflow definitions:', error)
          }
        }
        
        return data
      },
    ],
  },
  timestamps: true,
}
