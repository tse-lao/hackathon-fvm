import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Fragment, useEffect, useState } from 'react'


export default function CreateOverlay({ title, getOpen, changeOpen, children }) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setOpen(getOpen)
    }, [getOpen])

    const closeOverlay = (e) => {
        changeOpen(false)
        setOpen(false);

    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeOverlay}>
                <div className="fixed inset-0" />

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <form className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                                        <div className="h-0 flex-1 overflow-y-auto">
                                            <div className="bg-cf-700 px-4 py-6 sm:px-6">
                                                <div className="flex items-center justify-between">
                                                    <Dialog.Title className="text-base font-semibold leading-6 text-white">
                                                        {title}
                                                    </Dialog.Title>
                                                    <div className="ml-3 flex h-7 items-center">
                                                        <button
                                                            type="button"
                                                            className="rounded-md bg-cf-700 text-cf-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                                            onClick={closeOverlay}
                                                        >
                                                            <span className="sr-only">Close panel</span>
                                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="mt-1">
                                                    <p className="text-sm text-cf-300">
                                                       Please fill in the form and click submit.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-1 flex-col justify-between p-8">
                                               {children}
                                            </div>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

/* 交流QQ群:75457三77八 */