"use client"
import { Disclosure, Menu } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Suspense } from 'react'
import LoginButton from './application/elements/buttons/LoginButton'
 


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navigation({ active }) {
  return (
    <Disclosure as="nav" className="">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cf-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-center">

                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {/* Current: "border-cf-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                  <Link
                    href="/"
                    className={classNames(
                      "Dashboard" == active
                        ? 'inline-flex items-center border-b-2 border-cf-500 px-1 pt-1 text-sm font-medium text-gray-900  text-cf-500'
                        : 'inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    )}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/market"
                    className={classNames(
                      "Market" == active
                        ? 'inline-flex items-center border-b-2 border-cf-500 px-1 pt-1 text-sm font-medium text-cf-500'
                        : 'inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    )}
                  >
                    Marketplace
                  </Link>
                 
                  <Link
                    href="/jobs"
                    className={classNames(
                      "Jobs" == active
                        ? 'inline-flex items-center border-b-2 border-cf-500 px-1 pt-1 text-sm font-medium text-cf-500'
                        : 'inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    )}
                  >
                    Jobs
                  </Link>
                  <Link
                  href="/request"
                  className={classNames(
                    "Requests" == active
                      ? 'inline-flex items-center border-b-2 border-cf-500 px-1 pt-1 text-sm font-medium text-cf-500'
                      : 'inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  )}
                >
                  Requests
                </Link>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-4 flex-shrink-0 flex gap-6">
                <Suspense fallback={<span>Loading..</span>}>
                    <LoginButton />

                  </Suspense>
                </Menu>


              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-4">
              {/* Current: "bg-cf-50 border-cf-500 text-cf-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
              <Disclosure.Button
                as="a"
                href="/"
                className="block border-l-4 border-cf-500 bg-cf-50 py-2 pl-3 pr-4 text-base font-medium text-cf-700"
              >
                Dashboard
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="/files"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
              >
                Files
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="/market"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
              >
                Marketplace
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="/connections"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
              >
                Connections
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
