/**
 * WorkspaceSettings component
 * Allows users to configure workspace settings
 */
import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useWorkspace } from '../WorkspaceContext';
import { Settings, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Listbox } from '@headlessui/react';

interface WorkspaceSettingsProps {
  className?: string;
}

export function WorkspaceSettings({ className }: WorkspaceSettingsProps) {
  const { state, updateWorkspace } = useWorkspace();
  const { currentWorkspace } = state;
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [theme, setTheme] = useState(currentWorkspace?.settings?.theme || 'system');
  const [autoSaveInterval, setAutoSaveInterval] = useState(
    currentWorkspace?.settings?.autoSaveInterval?.toString() || '300000'
  );
  const [showCompletedTasks, setShowCompletedTasks] = useState(
    currentWorkspace?.settings?.showCompletedTasks !== false
  );
  const [prioritizeByDueDate, setPrioritizeByDueDate] = useState(
    currentWorkspace?.settings?.prioritizeByDueDate !== false
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    currentWorkspace?.settings?.notificationsEnabled !== false
  );
  
  // Theme options
  const themeOptions = [
    { id: 'light', name: 'Light' },
    { id: 'dark', name: 'Dark' },
    { id: 'system', name: 'System' },
  ];
  
  // Reset settings when dialog opens
  const handleOpen = () => {
    if (currentWorkspace) {
      setTheme(currentWorkspace.settings.theme || 'system');
      setAutoSaveInterval(currentWorkspace.settings.autoSaveInterval?.toString() || '300000');
      setShowCompletedTasks(currentWorkspace.settings.showCompletedTasks !== false);
      setPrioritizeByDueDate(currentWorkspace.settings.prioritizeByDueDate !== false);
      setNotificationsEnabled(currentWorkspace.settings.notificationsEnabled !== false);
    }
    setIsOpen(true);
  };
  
  // Save settings
  const handleSave = async () => {
    if (!currentWorkspace) return;
    
    setIsSubmitting(true);
    
    try {
      await updateWorkspace({
        ...currentWorkspace,
        settings: {
          ...currentWorkspace.settings,
          theme: theme as 'light' | 'dark' | 'system',
          autoSaveInterval: parseInt(autoSaveInterval),
          showCompletedTasks,
          prioritizeByDueDate,
          notificationsEnabled,
        },
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving workspace settings:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!currentWorkspace) {
    return null;
  }
  
  return (
    <>
      <button
        onClick={handleOpen}
        className={cn(
          "inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary",
          className
        )}
      >
        <Settings className="h-4 w-4 mr-1.5" />
        <span>Settings</span>
      </button>
      
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
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
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4"
                  >
                    Workspace Settings
                  </Dialog.Title>
                  
                  <div className="space-y-6">
                    {/* Theme setting */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Theme</label>
                      <Listbox value={theme} onChange={setTheme}>
                        <div className="relative mt-1">
                          <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm">
                            <span className="block truncate text-gray-900 dark:text-white">
                              {themeOptions.find(t => t.id === theme)?.name || 'System'}
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
                              {themeOptions.map((option) => (
                                <Listbox.Option
                                  key={option.id}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                      active ? 'bg-primary-50 dark:bg-primary-900/20 text-primary dark:text-primary-400' : 'text-gray-900 dark:text-gray-100'
                                    }`
                                  }
                                  value={option.id}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected ? 'font-medium' : 'font-normal'
                                        }`}
                                      >
                                        {option.name}
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
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Personalize the workspace appearance
                      </p>
                    </div>
                    
                    {/* Auto-save interval */}
                    <div>
                      <label htmlFor="autoSaveInterval" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Auto-save Interval (ms)
                      </label>
                      <input
                        id="autoSaveInterval"
                        type="number"
                        min="10000"
                        step="10000"
                        value={autoSaveInterval}
                        onChange={(e) => setAutoSaveInterval(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Time between automatic recovery points (minimum 10,000ms)
                      </p>
                    </div>
                    
                    {/* Toggle switches */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Show Completed Tasks
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Display completed tasks in the task list
                          </p>
                        </div>
                        <button
                          onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                          className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full",
                            showCompletedTasks ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                          )}
                        >
                          <span 
                            className={cn(
                              "inline-block h-4 w-4 transform rounded-full bg-white transition",
                              showCompletedTasks ? "translate-x-6" : "translate-x-1"
                            )}
                          />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Prioritize by Due Date
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Sort tasks with upcoming due dates first
                          </p>
                        </div>
                        <button
                          onClick={() => setPrioritizeByDueDate(!prioritizeByDueDate)}
                          className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full",
                            prioritizeByDueDate ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                          )}
                        >
                          <span 
                            className={cn(
                              "inline-block h-4 w-4 transform rounded-full bg-white transition",
                              prioritizeByDueDate ? "translate-x-6" : "translate-x-1"
                            )}
                          />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Enable Notifications
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Show notifications for tasks and updates
                          </p>
                        </div>
                        <button
                          onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                          className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full",
                            notificationsEnabled ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                          )}
                        >
                          <span 
                            className={cn(
                              "inline-block h-4 w-4 transform rounded-full bg-white transition",
                              notificationsEnabled ? "translate-x-6" : "translate-x-1"
                            )}
                          />
                        </button>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                      <p>
                        Settings are synchronized across windows and saved automatically in your recovery points.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setIsOpen(false)}
                      disabled={isSubmitting}
                      className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    
                    <button
                      onClick={handleSave}
                      disabled={isSubmitting}
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
