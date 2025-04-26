import { Endpoint } from 'payload/config'
import { PayloadRequest } from 'payload/types'
import { Response } from 'express'

/**
 * Start a new work session
 */
export const startSession: Endpoint = {
  path: '/sessions/start',
  method: 'post',
  handler: async (req: PayloadRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
      })
    }

    try {
      const { workspace, project, feature, workItem } = req.body || {}

      // Create a new session
      const session = await req.payload.create({
        collection: 'sessions',
        data: {
          sessionId: `session_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`,
          user: req.user.id,
          status: 'active',
          workspace,
          project,
          feature,
          task: workItem, // 'task' field in Sessions collection maps to workItem
          startedAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
          timeEntries: [
            {
              startedAt: new Date().toISOString(),
              type: 'work',
              description: 'Session started',
            },
          ],
          devices: [
            {
              windowId: req.body.windowId || `window_${Math.random().toString(36).substring(2, 11)}`,
              userAgent: req.headers['user-agent'],
              lastActiveAt: new Date().toISOString(),
              ipAddress: req.ip,
              platform: req.body.platform || 'unknown',
            },
          ],
        },
      })

      // Create an initial recovery point
      const recoveryPoint = await req.payload.create({
        collection: 'recovery-points',
        data: {
          recoveryPointId: `rp_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`,
          description: 'Session started',
          user: req.user.id,
          session: session.id,
          workspace,
          project,
          feature,
          type: 'auto',
          state: req.body.state || {},
          deviceInfo: {
            userAgent: req.headers['user-agent'],
            platform: req.body.platform || 'unknown',
            windowId: req.body.windowId || `window_${Math.random().toString(36).substring(2, 11)}`,
            ipAddress: req.ip,
          },
          tags: [
            {
              tag: 'session-start',
            },
          ],
        },
      })

      return res.status(200).json({
        message: 'Session started successfully',
        session,
        recoveryPoint,
      })
    } catch (error) {
      console.error('Error starting session:', error)
      return res.status(500).json({
        message: 'Error starting session',
        error: error.message,
      })
    }
  },
}

/**
 * Resume a paused session
 */
export const resumeSession: Endpoint = {
  path: '/sessions/:id/resume',
  method: 'post',
  handler: async (req: PayloadRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
      })
    }

    try {
      const { id } = req.params

      // Get the existing session
      const session = await req.payload.findByID({
        collection: 'sessions',
        id,
      })

      // Check if the session belongs to the user
      if (session.user.id !== req.user.id) {
        return res.status(403).json({
          message: 'Forbidden: You do not own this session',
        })
      }

      // Check if the session is in a pausable state
      if (session.status !== 'paused' && session.status !== 'expired') {
        return res.status(400).json({
          message: `Session is ${session.status}, cannot resume a session that is not paused or expired`,
        })
      }

      // Update the session
      const updatedSession = await req.payload.update({
        collection: 'sessions',
        id,
        data: {
          status: 'active',
          lastActiveAt: new Date().toISOString(),
          timeEntries: [
            ...(session.timeEntries || []),
            {
              startedAt: new Date().toISOString(),
              type: 'work',
              description: 'Session resumed',
            },
          ],
          devices: [
            ...(session.devices || []),
            {
              windowId: req.body.windowId || `window_${Math.random().toString(36).substring(2, 11)}`,
              userAgent: req.headers['user-agent'],
              lastActiveAt: new Date().toISOString(),
              ipAddress: req.ip,
              platform: req.body.platform || 'unknown',
            },
          ],
        },
      })

      // Create a recovery point for the resumed session
      const recoveryPoint = await req.payload.create({
        collection: 'recovery-points',
        data: {
          recoveryPointId: `rp_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`,
          description: 'Session resumed',
          user: req.user.id,
          session: id,
          workspace: session.workspace?.id,
          project: session.project?.id,
          feature: session.feature?.id,
          type: 'auto',
          state: req.body.state || {},
          deviceInfo: {
            userAgent: req.headers['user-agent'],
            platform: req.body.platform || 'unknown',
            windowId: req.body.windowId || `window_${Math.random().toString(36).substring(2, 11)}`,
            ipAddress: req.ip,
          },
          tags: [
            {
              tag: 'session-resume',
            },
          ],
        },
      })

      return res.status(200).json({
        message: 'Session resumed successfully',
        session: updatedSession,
        recoveryPoint,
      })
    } catch (error) {
      console.error('Error resuming session:', error)
      return res.status(500).json({
        message: 'Error resuming session',
        error: error.message,
      })
    }
  },
}

/**
 * Pause an active session
 */
export const pauseSession: Endpoint = {
  path: '/sessions/:id/pause',
  method: 'post',
  handler: async (req: PayloadRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
      })
    }

    try {
      const { id } = req.params

      // Get the existing session
      const session = await req.payload.findByID({
        collection: 'sessions',
        id,
      })

      // Check if the session belongs to the user
      if (session.user.id !== req.user.id) {
        return res.status(403).json({
          message: 'Forbidden: You do not own this session',
        })
      }

      // Check if the session is in an active state
      if (session.status !== 'active') {
        return res.status(400).json({
          message: `Session is ${session.status}, cannot pause a session that is not active`,
        })
      }

      // Update time entries to include end time for the active entry
      const timeEntries = [...(session.timeEntries || [])]
      const lastEntry = timeEntries[timeEntries.length - 1]
      
      if (lastEntry && !lastEntry.endedAt) {
        const startTime = new Date(lastEntry.startedAt).getTime()
        const endTime = Date.now()
        const durationMinutes = Math.round((endTime - startTime) / (1000 * 60))
        
        timeEntries[timeEntries.length - 1] = {
          ...lastEntry,
          endedAt: new Date().toISOString(),
          duration: durationMinutes,
        }
      }

      // Update the session
      const updatedSession = await req.payload.update({
        collection: 'sessions',
        id,
        data: {
          status: 'paused',
          lastActiveAt: new Date().toISOString(),
          timeEntries,
        },
      })

      // Create a recovery point for the paused session
      const recoveryPoint = await req.payload.create({
        collection: 'recovery-points',
        data: {
          recoveryPointId: `rp_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`,
          description: 'Session paused',
          user: req.user.id,
          session: id,
          workspace: session.workspace?.id,
          project: session.project?.id,
          feature: session.feature?.id,
          type: 'auto',
          state: req.body.state || {},
          deviceInfo: {
            userAgent: req.headers['user-agent'],
            platform: req.body.platform || 'unknown',
            windowId: req.body.windowId || `window_${Math.random().toString(36).substring(2, 11)}`,
            ipAddress: req.ip,
          },
          tags: [
            {
              tag: 'session-pause',
            },
          ],
        },
      })

      return res.status(200).json({
        message: 'Session paused successfully',
        session: updatedSession,
        recoveryPoint,
      })
    } catch (error) {
      console.error('Error pausing session:', error)
      return res.status(500).json({
        message: 'Error pausing session',
        error: error.message,
      })
    }
  },
}

/**
 * Complete a session
 */
export const completeSession: Endpoint = {
  path: '/sessions/:id/complete',
  method: 'post',
  handler: async (req: PayloadRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
      })
    }

    try {
      const { id } = req.params

      // Get the existing session
      const session = await req.payload.findByID({
        collection: 'sessions',
        id,
      })

      // Check if the session belongs to the user
      if (session.user.id !== req.user.id) {
        return res.status(403).json({
          message: 'Forbidden: You do not own this session',
        })
      }

      // Check if the session is in a completable state
      if (session.status === 'completed') {
        return res.status(400).json({
          message: 'Session is already completed',
        })
      }

      // Update time entries to include end time for the active entry
      const timeEntries = [...(session.timeEntries || [])]
      const lastEntry = timeEntries[timeEntries.length - 1]
      
      if (lastEntry && !lastEntry.endedAt && session.status === 'active') {
        const startTime = new Date(lastEntry.startedAt).getTime()
        const endTime = Date.now()
        const durationMinutes = Math.round((endTime - startTime) / (1000 * 60))
        
        timeEntries[timeEntries.length - 1] = {
          ...lastEntry,
          endedAt: new Date().toISOString(),
          duration: durationMinutes,
        }
      }

      // Calculate total duration
      const completedAt = new Date().toISOString()
      const startedAt = new Date(session.startedAt).getTime()
      const completedTime = new Date(completedAt).getTime()
      const totalDurationMinutes = Math.round((completedTime - startedAt) / (1000 * 60))

      // Calculate active duration from time entries
      const activeDurationMinutes = timeEntries.reduce((total, entry) => {
        if (entry.duration) {
          return total + entry.duration
        }
        return total
      }, 0)

      // Update the session
      const updatedSession = await req.payload.update({
        collection: 'sessions',
        id,
        data: {
          status: 'completed',
          lastActiveAt: new Date().toISOString(),
          completedAt,
          totalDuration: totalDurationMinutes,
          activeDuration: activeDurationMinutes,
          timeEntries,
        },
      })

      // Create a final recovery point for the completed session
      const recoveryPoint = await req.payload.create({
        collection: 'recovery-points',
        data: {
          recoveryPointId: `rp_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`,
          description: 'Session completed',
          user: req.user.id,
          session: id,
          workspace: session.workspace?.id,
          project: session.project?.id,
          feature: session.feature?.id,
          type: 'auto',
          state: req.body.state || {},
          deviceInfo: {
            userAgent: req.headers['user-agent'],
            platform: req.body.platform || 'unknown',
            windowId: req.body.windowId || `window_${Math.random().toString(36).substring(2, 11)}`,
            ipAddress: req.ip,
          },
          tags: [
            {
              tag: 'session-complete',
            },
          ],
        },
      })

      return res.status(200).json({
        message: 'Session completed successfully',
        session: updatedSession,
        recoveryPoint,
        totalDuration: totalDurationMinutes,
        activeDuration: activeDurationMinutes,
      })
    } catch (error) {
      console.error('Error completing session:', error)
      return res.status(500).json({
        message: 'Error completing session',
        error: error.message,
      })
    }
  },
}

/**
 * Save the current work context
 */
export const saveSessionContext: Endpoint = {
  path: '/sessions/:id/context',
  method: 'post',
  handler: async (req: PayloadRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
      })
    }

    try {
      const { id } = req.params
      const { context, description } = req.body || {}

      // Get the existing session
      const session = await req.payload.findByID({
        collection: 'sessions',
        id,
      })

      // Check if the session belongs to the user
      if (session.user.id !== req.user.id) {
        return res.status(403).json({
          message: 'Forbidden: You do not own this session',
        })
      }

      // Check if the session is in an active state
      if (session.status !== 'active') {
        return res.status(400).json({
          message: `Session is ${session.status}, cannot update context for a session that is not active`,
        })
      }

      // Update the session context
      const updatedSession = await req.payload.update({
        collection: 'sessions',
        id,
        data: {
          context,
          lastActiveAt: new Date().toISOString(),
        },
      })

      // Create a recovery point with the context
      const recoveryPoint = await req.payload.create({
        collection: 'recovery-points',
        data: {
          recoveryPointId: `rp_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`,
          description: description || 'Session context updated',
          user: req.user.id,
          session: id,
          workspace: session.workspace?.id,
          project: session.project?.id,
          feature: session.feature?.id,
          type: 'auto',
          state: context,
          deviceInfo: {
            userAgent: req.headers['user-agent'],
            platform: req.body.platform || 'unknown',
            windowId: req.body.windowId || `window_${Math.random().toString(36).substring(2, 11)}`,
            ipAddress: req.ip,
          },
          tags: [
            {
              tag: 'context-update',
            },
          ],
        },
      })

      return res.status(200).json({
        message: 'Session context saved successfully',
        session: updatedSession,
        recoveryPoint,
      })
    } catch (error) {
      console.error('Error saving session context:', error)
      return res.status(500).json({
        message: 'Error saving session context',
        error: error.message,
      })
    }
  },
}

/**
 * Low-level API to save the current work state
 */
export const saveSessionState: Endpoint = {
  path: '/session-tracking/save-state',
  method: 'post',
  handler: async (req: PayloadRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
      })
    }

    try {
      const { 
        sessionId, 
        state, 
        description, 
        type = 'auto', 
        workspace, 
        project, 
        feature, 
        workItem 
      } = req.body || {}

      // Find session if sessionId is provided
      let session = null
      if (sessionId) {
        try {
          session = await req.payload.findByID({
            collection: 'sessions',
            id: sessionId,
          })

          // Check if the session belongs to the user
          if (session.user.id !== req.user.id) {
            return res.status(403).json({
              message: 'Forbidden: You do not own this session',
            })
          }

          // Update session lastActiveAt
          await req.payload.update({
            collection: 'sessions',
            id: sessionId,
            data: {
              lastActiveAt: new Date().toISOString(),
            },
          })
        } catch (error) {
          console.error('Error finding session:', error)
          // Continue execution even if session is not found
        }
      }

      // Create a recovery point
      const recoveryPoint = await req.payload.create({
        collection: 'recovery-points',
        data: {
          recoveryPointId: `rp_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`,
          description: description || 'State saved',
          user: req.user.id,
          session: session?.id,
          workspace,
          project,
          feature,
          type,
          state,
          deviceInfo: {
            userAgent: req.headers['user-agent'],
            platform: req.body.platform || 'unknown',
            windowId: req.body.windowId || `window_${Math.random().toString(36).substring(2, 11)}`,
            ipAddress: req.ip,
          },
          tags: req.body.tags || [
            {
              tag: 'state-save',
            },
          ],
        },
      })

      return res.status(200).json({
        message: 'State saved successfully',
        recoveryPoint,
      })
    } catch (error) {
      console.error('Error saving state:', error)
      return res.status(500).json({
        message: 'Error saving state',
        error: error.message,
      })
    }
  },
}

// Export all session endpoints
export const sessionEndpoints = [
  startSession,
  resumeSession,
  pauseSession,
  completeSession,
  saveSessionContext,
  saveSessionState,
]
