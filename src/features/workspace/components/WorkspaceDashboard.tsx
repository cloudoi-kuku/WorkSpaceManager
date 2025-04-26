/**
 * WorkspaceDashboard component
 * Main interface for workspace management
 */
import { useState } from 'react';
import { useWorkspace } from '../WorkspaceContext';
import { WorkspaceSelector } from './WorkspaceSelector';
import { WorkspaceDialog } from './WorkspaceDialog';
import { TaskDialog } from './TaskDialog';
import { WorkspaceSettings } from './WorkspaceSettings';
import { PlusCircle, Edit, Trash2, CheckSquare, MoreVertical, Calendar, Tag } from 'lucide-react';
import { WorkspaceTask } from '../types';
import { Disclosure, Menu } from '@headlessui/react';

export function WorkspaceDashboard() {
  const { state, deleteTask } = useWorkspace();
  const { currentWorkspace } = state;
  
  const [isWorkspaceDialogOpen, setIsWorkspaceDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<WorkspaceTask | undefined>(undefined);
  
  // Open task dialog for editing
  const handleEditTask = (task: WorkspaceTask) => {
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };
  
  // Delete a task with confirmation
  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };
  
  // Create new task
  const handleCreateTask = () => {
    setSelectedTask(undefined);
    setIsTaskDialogOpen(true);
  };
  
  // Task status badge styles
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Workspace Dashboard</h2>
        <WorkspaceSelector onCreateNew={() => setIsWorkspaceDialogOpen(true)} />
      </div>
      
      {currentWorkspace ? (
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{currentWorkspace.name}</h3>
                {currentWorkspace.description && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{currentWorkspace.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <WorkspaceSettings />
                <button
                  onClick={() => setIsWorkspaceDialogOpen(true)}
                  className="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <Edit className="h-4 w-4 mr-1.5" />
                  Edit
                </button>
              </div>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-medium text-gray-900 dark:text-white">Tasks</h4>
                <button
                  onClick={handleCreateTask}
                  className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <PlusCircle className="h-4 w-4 mr-1.5" />
                  Add Task
                </button>
              </div>
              
              {currentWorkspace.tasks.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tasks</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new task.</p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={handleCreateTask}
                      className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      New Task
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden bg-white dark:bg-gray-800 shadow sm:rounded-md">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {currentWorkspace.tasks.map((task) => (
                      <li key={task.id}>
                        <Disclosure>
                          {({ open }) => (
                            <>
                              <div className="flex items-center px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center">
                                    <p className="font-medium text-gray-900 dark:text-white truncate">{task.title}</p>
                                    <span className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(task.status)}`}>
                                      {task.status}
                                    </span>
                                  </div>
                                  {task.description && (
                                    <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                      <p className="truncate">{task.description}</p>
                                    </div>
                                  )}
                                  <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
                                    {task.dueDate && (
                                      <div className="flex items-center">
                                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                        <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center">
                                      <Tag className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                      <span>ID: {task.id.substring(0, 8)}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex shrink-0 ml-5 gap-3">
                                  <Disclosure.Button
                                    className="rounded-full p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                                  >
                                    <span className="sr-only">{open ? 'Hide details' : 'Show details'}</span>
                                    <svg className={`h-5 w-5 transform ${open ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </Disclosure.Button>
                                  <Menu as="div" className="relative inline-block text-left">
                                    <div>
                                      <Menu.Button className="rounded-full p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary">
                                        <span className="sr-only">Open options</span>
                                        <MoreVertical className="h-5 w-5" aria-hidden="true" />
                                      </Menu.Button>
                                    </div>
                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                      <div className="py-1">
                                        <Menu.Item>
                                          {({ active }) => (
                                            <button
                                              onClick={() => handleEditTask(task)}
                                              className={`${
                                                active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                                              } flex w-full items-center px-4 py-2 text-sm`}
                                            >
                                              <Edit className="mr-3 h-4 w-4" aria-hidden="true" />
                                              Edit
                                            </button>
                                          )}
                                        </Menu.Item>
                                        {task.status !== 'completed' && (
                                          <Menu.Item>
                                            {({ active }) => (
                                              <button
                                                onClick={() => handleEditTask({
                                                  ...task,
                                                  status: 'completed'
                                                })}
                                                className={`${
                                                  active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                                                } flex w-full items-center px-4 py-2 text-sm`}
                                              >
                                                <CheckSquare className="mr-3 h-4 w-4" aria-hidden="true" />
                                                Mark Complete
                                              </button>
                                            )}
                                          </Menu.Item>
                                        )}
                                        <Menu.Item>
                                          {({ active }) => (
                                            <button
                                              onClick={() => handleDeleteTask(task.id)}
                                              className={`${
                                                active ? 'bg-gray-100 dark:bg-gray-700 text-red-600 dark:text-red-400' : 'text-red-500 dark:text-red-500'
                                              } flex w-full items-center px-4 py-2 text-sm`}
                                            >
                                              <Trash2 className="mr-3 h-4 w-4" aria-hidden="true" />
                                              Delete
                                            </button>
                                          )}
                                        </Menu.Item>
                                      </div>
                                    </Menu.Items>
                                  </Menu>
                                </div>
                              </div>
                              <Disclosure.Panel className="px-4 py-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                                <div className="space-y-4">
                                  {task.description && (
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Description</h4>
                                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{task.description}</p>
                                    </div>
                                  )}
                                  {task.notes && (
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Notes</h4>
                                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{task.notes}</p>
                                    </div>
                                  )}
                                  <div className="flex flex-wrap gap-2 mt-4">
                                    <button
                                      onClick={() => handleEditTask(task)}
                                      className="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                    >
                                      <Edit className="h-3.5 w-3.5 mr-1" />
                                      Edit
                                    </button>
                                    {task.status !== 'completed' && (
                                      <button
                                        onClick={() => handleEditTask({
                                          ...task,
                                          status: 'completed'
                                        })}
                                        className="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                      >
                                        <CheckSquare className="h-3.5 w-3.5 mr-1" />
                                        Complete
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="inline-flex items-center rounded-md border border-red-300 dark:border-red-700 bg-white dark:bg-gray-700 px-2.5 py-1.5 text-xs font-medium text-red-700 dark:text-red-400 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
              Last updated: {new Date(currentWorkspace.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No workspace selected</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new workspace.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setIsWorkspaceDialogOpen(true)}
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Workspace
            </button>
          </div>
        </div>
      )}
      
      {/* Dialogs */}
      <WorkspaceDialog
        isOpen={isWorkspaceDialogOpen}
        onClose={() => setIsWorkspaceDialogOpen(false)}
        workspace={currentWorkspace || undefined}
      />
      
      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        task={selectedTask}
      />
    </div>
  );
}
