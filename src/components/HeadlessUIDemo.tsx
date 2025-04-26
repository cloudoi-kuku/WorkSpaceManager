import React, { useState, Fragment } from 'react';
import { Dialog, Transition, Menu, Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function HeadlessUIDemo() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card className="max-w-md mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-center">Headless UI Components Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dialog Demo */}
        <div>
          <h3 className="font-medium mb-2">Dialog (Modal)</h3>
          <Button onClick={() => setIsDialogOpen(true)}>Open Dialog</Button>
          
          <Transition appear show={isDialogOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setIsDialogOpen(false)}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/25" />
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
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Headless UI Dialog
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          This is a fully functional dialog with transitions and backdrop.
                          Click outside or the close button to dismiss.
                        </p>
                      </div>

                      <div className="mt-4">
                        <Button
                          type="button"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Close Dialog
                        </Button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>

        {/* Menu Demo */}
        <div>
          <h3 className="font-medium mb-2">Menu (Dropdown)</h3>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                Options
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-primary text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Edit
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-primary text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Duplicate
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-primary text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Archive
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-primary text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        {/* Disclosure Demo */}
        <div>
          <h3 className="font-medium mb-2">Disclosure (Accordion)</h3>
          <div className="w-full max-w-md rounded-2xl bg-white p-2">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-primary/10 px-4 py-2 text-left text-sm font-medium text-primary hover:bg-primary/20 focus:outline-none focus-visible:ring focus-visible:ring-primary">
                    <span>What is Headless UI?</span>
                    <ChevronUpIcon
                      className={`${
                        open ? '' : 'rotate-180 transform'
                      } h-5 w-5 text-primary`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                    Headless UI is a completely unstyled, fully accessible UI component library 
                    designed to integrate beautifully with Tailwind CSS. It provides the functionality
                    but lets you control all the styling.
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-primary/10 px-4 py-2 text-left text-sm font-medium text-primary hover:bg-primary/20 focus:outline-none focus-visible:ring focus-visible:ring-primary">
                    <span>How to style Headless UI?</span>
                    <ChevronUpIcon
                      className={`${
                        open ? '' : 'rotate-180 transform'
                      } h-5 w-5 text-primary`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                    You can style Headless UI components with any CSS framework, 
                    but it's designed to work seamlessly with Tailwind CSS. Just add
                    your classes to the components for your desired look and feel.
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
