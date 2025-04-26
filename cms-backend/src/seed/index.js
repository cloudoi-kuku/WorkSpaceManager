export const seed = async (payload) => {
  payload.logger.info('Seeding database...')

  // Create admin user if it doesn't exist
  const { docs: existingUsers } = await payload.find({
    collection: 'users',
    limit: 1,
  })

  if (existingUsers.length === 0) {
    payload.logger.info('Creating admin user...')
    
    try {
      await payload.create({
        collection: 'users',
        data: {
          email: 'admin@example.com',
          password: 'password123',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
        },
      })
      
      await payload.create({
        collection: 'users',
        data: {
          email: 'user@example.com',
          password: 'password123',
          firstName: 'Regular',
          lastName: 'User',
          role: 'user',
        },
      })
      
      payload.logger.info('Admin and regular users created successfully')
    } catch (error) {
      payload.logger.error('Error creating users:')
      payload.logger.error(error)
    }
  }

  // Create sample workspace if none exist
  const { docs: existingWorkspaces } = await payload.find({
    collection: 'workspaces',
    limit: 1,
  })

  if (existingWorkspaces.length === 0) {
    payload.logger.info('Creating sample workspace...')
    
    try {
      // Find admin user
      const { docs: adminUsers } = await payload.find({
        collection: 'users',
        where: {
          role: {
            equals: 'admin',
          },
        },
        limit: 1,
      })
      
      if (adminUsers.length > 0) {
        const adminUser = adminUsers[0]
        
        // Create a workspace
        const workspace = await payload.create({
          collection: 'workspaces',
          data: {
            name: 'Sample Workspace',
            description: 'A sample workspace for development',
            icon: 'briefcase',
            color: 'blue',
            members: [
              {
                user: adminUser.id,
                role: 'admin',
                joinedAt: new Date().toISOString(),
              },
            ],
          },
        })
        
        // Create a project in the workspace
        const project = await payload.create({
          collection: 'projects',
          data: {
            name: 'Sample Project',
            description: 'A sample project for development',
            workspace: workspace.id,
            status: 'in-progress',
            priority: 'medium',
            startDate: new Date().toISOString(),
            assignees: [
              {
                user: adminUser.id,
                role: 'manager',
                assignedAt: new Date().toISOString(),
              },
            ],
            tags: [
              {
                tag: 'sample',
              },
              {
                tag: 'development',
              },
            ],
          },
        })
        
        // Create a workflow definition
        const workflow = await payload.create({
          collection: 'workflow-definitions',
          data: {
            name: 'Default Workflow',
            description: 'Default workflow for feature development',
            workspace: workspace.id,
            isDefault: true,
            stages: [
              {
                name: 'Proposed',
                description: 'Feature has been proposed but not yet approved',
                color: 'gray',
                order: 0,
                requiresApproval: false,
              },
              {
                name: 'Approved',
                description: 'Feature has been approved for development',
                color: 'blue',
                order: 1,
                requiresApproval: true,
              },
              {
                name: 'In Development',
                description: 'Feature is actively being developed',
                color: 'yellow',
                order: 2,
                requiresApproval: false,
              },
              {
                name: 'In Review',
                description: 'Feature is being reviewed',
                color: 'purple',
                order: 3,
                requiresApproval: false,
              },
              {
                name: 'Testing',
                description: 'Feature is being tested',
                color: 'orange',
                order: 4,
                requiresApproval: false,
              },
              {
                name: 'Done',
                description: 'Feature has been completed',
                color: 'green',
                order: 5,
                requiresApproval: true,
              },
            ],
            transitionRules: [
              {
                fromStage: 0,
                toStage: 1,
                condition: 'require-approval',
              },
              {
                fromStage: 1,
                toStage: 2,
                condition: 'always',
              },
              {
                fromStage: 2,
                toStage: 3,
                condition: 'always',
              },
              {
                fromStage: 3,
                toStage: 4,
                condition: 'always',
              },
              {
                fromStage: 4,
                toStage: 5,
                condition: 'require-approval',
              },
            ],
          },
        })
        
        // Create a feature in the project
        const feature = await payload.create({
          collection: 'features',
          data: {
            title: 'Sample Feature',
            description: '<p>A sample feature for development</p>',
            project: project.id,
            status: 'proposed',
            priority: 'medium',
            workflowDefinition: workflow.id,
            assignees: [
              {
                user: adminUser.id,
                role: 'owner',
                assignedAt: new Date().toISOString(),
              },
            ],
            tags: [
              {
                tag: 'sample',
              },
            ],
          },
        })
        
        // Create work items for the feature
        const workItem1 = await payload.create({
          collection: 'work-items',
          data: {
            title: 'Design Sample Feature',
            description: '<p>Create design specifications for the sample feature</p>',
            feature: feature.id,
            type: 'task',
            status: 'todo',
            priority: 'high',
            assignee: adminUser.id,
            estimatedHours: 4,
          },
        })
        
        const workItem2 = await payload.create({
          collection: 'work-items',
          data: {
            title: 'Implement Sample Feature',
            description: '<p>Implement the sample feature according to design specs</p>',
            feature: feature.id,
            type: 'task',
            status: 'todo',
            priority: 'medium',
            assignee: adminUser.id,
            estimatedHours: 8,
            dependencies: [
              {
                workItem: workItem1.id,
                type: 'blocks',
                notes: 'Implementation can only start after design is complete',
              },
            ],
          },
        })
        
        const workItem3 = await payload.create({
          collection: 'work-items',
          data: {
            title: 'Test Sample Feature',
            description: '<p>Create and execute test cases for the sample feature</p>',
            feature: feature.id,
            type: 'test',
            status: 'todo',
            priority: 'medium',
            assignee: adminUser.id,
            estimatedHours: 4,
            dependencies: [
              {
                workItem: workItem2.id,
                type: 'blocks',
                notes: 'Testing can only start after implementation is complete',
              },
            ],
          },
        })
        
        // Create a dependency between work items
        await payload.create({
          collection: 'dependencies',
          data: {
            description: 'Implementation depends on design',
            sourceType: 'work-item',
            sourceId: workItem2.id,
            targetType: 'work-item',
            targetId: workItem1.id,
            type: 'blocks',
            strength: 'strong',
            state: 'active',
            workspace: workspace.id,
            project: project.id,
            notes: 'Implementation can only start after design is complete',
          },
        })
        
        await payload.create({
          collection: 'dependencies',
          data: {
            description: 'Testing depends on implementation',
            sourceType: 'work-item',
            sourceId: workItem3.id,
            targetType: 'work-item',
            targetId: workItem2.id,
            type: 'blocks',
            strength: 'strong',
            state: 'active',
            workspace: workspace.id,
            project: project.id,
            notes: 'Testing can only start after implementation is complete',
          },
        })
        
        // Create a task
        await payload.create({
          collection: 'tasks',
          data: {
            title: 'Update README',
            description: 'Update the project README with setup instructions',
            project: project.id,
            status: 'todo',
            priority: 'low',
            assignee: adminUser.id,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          },
        })
        
        // Create a session
        await payload.create({
          collection: 'sessions',
          data: {
            sessionId: `session_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`,
            user: adminUser.id,
            status: 'active',
            workspace: workspace.id,
            project: project.id,
            startedAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
            timeEntries: [
              {
                startedAt: new Date().toISOString(),
                type: 'work',
                description: 'Initial session',
              },
            ],
            devices: [
              {
                windowId: `window_${Math.random().toString(36).substring(2, 11)}`,
                userAgent: 'Seed Script',
                lastActiveAt: new Date().toISOString(),
              },
            ],
          },
        })
        
        // Create a recovery point
        await payload.create({
          collection: 'recovery-points',
          data: {
            recoveryPointId: `rp_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`,
            description: 'Initial workspace setup',
            user: adminUser.id,
            workspace: workspace.id,
            project: project.id,
            type: 'manual',
            state: {
              workspaceId: workspace.id,
              projectId: project.id,
              featureId: feature.id,
              activeWorkItems: [workItem1.id, workItem2.id],
            },
            deviceInfo: {
              userAgent: 'Seed Script',
              platform: 'Node.js',
              windowId: `window_${Math.random().toString(36).substring(2, 11)}`,
            },
            tags: [
              {
                tag: 'initial',
              },
              {
                tag: 'seed',
              },
            ],
          },
        })
        
        // Create an AI conversation
        await payload.create({
          collection: 'ai-conversations',
          data: {
            title: 'Feature Planning Discussion',
            user: adminUser.id,
            workspace: workspace.id,
            project: project.id,
            feature: feature.id,
            modelName: 'deepseek-coder',
            systemPrompt: 'You are a helpful assistant specialized in software development and project planning.',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful assistant specialized in software development and project planning.',
                timestamp: new Date().toISOString(),
              },
              {
                role: 'user',
                content: 'I need help planning the implementation of the sample feature. What are the key steps?',
                timestamp: new Date().toISOString(),
              },
              {
                role: 'assistant',
                content: 'I recommend breaking down the implementation into these key steps:\n\n1. **Requirements Gathering**: Document all functional and non-functional requirements clearly.\n\n2. **Design Phase**: Create a detailed design document covering architecture, data models, and UI/UX.\n\n3. **Implementation**: Break down into smaller tasks like API development, UI implementation, and core functionality.\n\n4. **Testing**: Develop unit tests, integration tests, and end-to-end tests.\n\n5. **Documentation**: Prepare user documentation and developer documentation.\n\n6. **Deployment**: Plan for a phased rollout with appropriate monitoring.\n\nWould you like me to elaborate on any of these steps?',
                timestamp: new Date().toISOString(),
              },
            ],
            tags: [
              {
                tag: 'planning',
              },
              {
                tag: 'development',
              },
            ],
            parameters: {
              temperature: 0.7,
              top_p: 0.95,
              max_tokens: 1000,
            },
          },
        })
        
        payload.logger.info('Sample data created successfully')
      } else {
        payload.logger.error('Admin user not found')
      }
    } catch (error) {
      payload.logger.error('Error creating sample data:')
      payload.logger.error(error)
    }
  }

  payload.logger.info('Seeding complete')
}
