/**
 * TaskDialog component
 * Uses Headless UI Dialog for accessible modal implementation
 */
import { Fragment, useState } from 'react';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { useWorkspace } from '../WorkspaceContext';
import { WorkspaceTask } from '../types';
import { Check, ChevronDown, X, Calendar } from 'lucide-react';
import { useSession } from '@/features/session';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task?: WorkspaceTask; // If provided, edit mode. Otherwise, create mode.
}

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export function TaskDialog({ isOpen, onClose, task }: TaskDialogProps) {
  const { createTask, updateTask } = useWorkspace();
  const { sessionId } = useSession();
  
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState(task?.status || 'todo');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [notes, setNotes] = useState(task?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isEditMode = !!task;
  
  // Reset form when dialog opens/closes or task changes
  const resetForm = () => {
    setTitle(task?.title || '');
    setDescription(task?.description || '');
    setStatus(task?.status || 'todo');
    setDueDate(task?.dueDate || '');
    setNotes(task?.notes || '');
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
    
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (isEditMode && task) {
        await updateTask({
          ...task,
          title: title.trim(),
          description: description.trim() || undefined,
          status: status as 'todo' | 'in-progress' | 'completed',
          dueDate: dueDate || undefined,
          notes: notes.trim() || undefined,
        });
      } else {
        await createTask(title.trim(), description.trim() || undefined);
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
                    {isEditMode ? 'Edit Task' : 'Create New Task'}
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
                        htmlFor={`task-title-${sessionId}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Task Title
                      </label>
                      <input
                        type="text"
                        id={`task-title-${sessionId}`}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter task title"
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label 
                        htmlFor={`task-description-${sessionId}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Description (optional)
                      </label>
                      <textarea
                        id={`task-description-${sessionId}`}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter task description"
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    
                    {isEditMode && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Status
                        </label>
                        <Listbox value={status} onChange={setStatus}>
                          <div className="relative mt-1">
                            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                              <span className="block truncate text-gray-900 dark:text-white">
                                {statusOptions.find(option => option.value === status)?.label}
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronDown
                                  className="h-4 w-4 text-gray-400 dark:text-gray-500"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {statusOptions.map((option) => (
                                  <Listbox.Option
                                    key={option.value}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active ? 'bg-primary-50 dark:bg-primary-900/20 text-primary dark:text-primary-400' : 'text-gray-900 dark:text-gray-100'
                                      }`
                                    }
                                    value={option.value}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected ? 'font-medium' : 'font-normal'
                                          }`}
                                        >
                                          {option.label}
                                        </span>
                                        {selected ? (
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary dark:text-primary-400">
                                            <Check className="h-4 w-4" aria-hidden="true" />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      </div>
                    )}
                    
                    <div>
                      <label 
                        htmlFor={`task-due-date-${sessionId}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Due Date (optional)</span>
                        </div>
                      </label>
                      <input
                        type="date"
                        id={`task-due-date-${sessionId}`}
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    
                    {isEditMode && (
                      <div>
                        <label 
                          htmlFor={`task-notes-${sessionId}`}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Notes (optional)
                        </label>
                        <textarea
                          id={`task-notes-${sessionId}`}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Enter additional notes"
                          rows={3}
                          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                      </div>
                    )}
                    
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
                        : 'Create Task'}
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
