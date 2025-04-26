/**
 * WorkspaceDialog component
 * Uses Headless UI Dialog for accessible modal implementation
 */
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useWorkspace } from '../WorkspaceContext';
import { Workspace } from '../types';
import { X } from 'lucide-react';
import { useSession } from '@/features/session';

interface WorkspaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workspace?: Workspace; // If provided, edit mode. Otherwise, create mode.
}

export function WorkspaceDialog({ isOpen, onClose, workspace }: WorkspaceDialogProps) {
  const { createWorkspace, updateWorkspace } = useWorkspace();
  const { sessionId } = useSession();
  
  const [name, setName] = useState(workspace?.name || '');
  const [description, setDescription] = useState(workspace?.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isEditMode = !!workspace;
  
  // Reset form when dialog opens/closes or workspace changes
  const resetForm = () => {
    setName(workspace?.name || '');
    setDescription(workspace?.description || '');
    setError(null);
  };
  
  // Handle closing the dialog
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Workspace name is required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (isEditMode && workspace) {
        await updateWorkspace({
          ...workspace,
          name: name.trim(),
          description: description.trim() || undefined,
        });
      } else {
        await createWorkspace(name.trim(), description.trim() || undefined);
      }
      
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    {isEditMode ? 'Edit Workspace' : 'Create New Workspace'}
                  </Dialog.Title>
                  <button 
                    onClick={handleClose}
                    className="rounded-full p-1 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label 
                        htmlFor={`workspace-name-${sessionId}`} 
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Workspace Name
                      </label>
                      <input
                        type="text"
                        id={`workspace-name-${sessionId}`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter workspace name"
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label 
                        htmlFor={`workspace-description-${sessionId}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Description (optional)
                      </label>
                      <textarea
                        id={`workspace-description-${sessionId}`}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter workspace description"
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    
                    {error && (
                      <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                        <div className="flex">
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Error</h3>
                            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                              <p>{error}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      {isSubmitting
                        ? 'Saving...'
                        : isEditMode
                        ? 'Save Changes'
                        : 'Create Workspace'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
