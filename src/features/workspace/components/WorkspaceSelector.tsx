/**
 * WorkspaceSelector component
 * Uses Headless UI Listbox for accessible dropdown implementation
 */
import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown, PlusCircle } from 'lucide-react';
import { useWorkspace } from '../WorkspaceContext';

interface WorkspaceSelectorProps {
  onCreateNew: () => void;
}

export function WorkspaceSelector({ onCreateNew }: WorkspaceSelectorProps) {
  const { state, switchWorkspace } = useWorkspace();
  const { currentWorkspace, workspaces } = state;

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">No workspaces available</div>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <PlusCircle className="h-4 w-4 mr-1.5" />
          <span>New Workspace</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Listbox value={currentWorkspace} onChange={(workspace) => switchWorkspace(workspace.id)}>
        <div className="relative w-60">
          <Listbox.Button className="relative w-full cursor-default rounded-md bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm">
            <span className="block truncate">{currentWorkspace.name}</span>
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
              {workspaces.map((workspace) => (
                <Listbox.Option
                  key={workspace.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-primary-50 dark:bg-primary-900/20 text-primary dark:text-primary-400' : 'text-gray-900 dark:text-gray-100'
                    }`
                  }
                  value={workspace}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {workspace.name}
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
      <button
        onClick={onCreateNew}
        className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <PlusCircle className="h-4 w-4 mr-1.5" />
        <span className="hidden sm:inline">New Workspace</span>
        <span className="sm:hidden">New</span>
      </button>
    </div>
  );
}
