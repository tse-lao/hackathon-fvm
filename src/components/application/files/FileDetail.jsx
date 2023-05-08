import { Dialog, Transition } from '@headlessui/react'
import { HeartIcon, XMarkIcon } from '@heroicons/react/24/outline'
import lighthouse from '@lighthouse-web3/sdk'
import { Fragment, useEffect, useState } from 'react'
import FileDealStatus from './FileDealStatus'
import FileDetailInformation from './FileDetailInformation'
import FileSharedWith from './FileSharedWith'

export default function FileDetail({file}) {
  const [open, setOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [dealStatus, setDealStatus] = useState(null)
  
  
  useEffect(() => {
    setLoading(true);
    
    const getDealStatus = async () => {
      if(file.status != "queued"){
      const status = await lighthouse.dealStatus(file.cid)
      console.log(status)
      
      setDealStatus(status.data)
    }
    
    setDealStatus({status: "queued"})
  }
    
    getDealStatus()
  }, [file])
  
  const getCar = async () => {
    
    const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY;
    const authToken = await lighthouse.dataDepotAuth(apiKey)
    
    console.log(authToken)
  // Create CAR
    const response = await lighthouse.createCar("https://gateway.lighthouse.storage/ipfs/"+file.cid, authToken.data.access_token)
    
    console.log(response)
    
  }


  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-128">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-full overflow-y-auto bg-white p-8">
                    <div className="space-y-6 pb-16">
                      <div>
                        <div className="mt-4 flex items-start justify-between">
                          <div>
                            <h2 className="text-base font-semibold leading-6 text-gray-900">
                              <span className="sr-only">Details for </span>{file.fileName}
                            </h2>
                            <p className="text-sm font-medium text-gray-500">{file.fileSizeInBytes} Bytes</p>
                          </div>
                          <button
                            type="button"
                            className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <HeartIcon className="h-6 w-6" aria-hidden="true" />
                            <span className="sr-only">Favorite</span>
                          </button>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Information</h3>
                          <FileDetailInformation detail={file} />
                      </div>
                      <FileDealStatus dealStatus={dealStatus} />
                      <FileSharedWith cid={file.cid}/>
                      <div className="flex">
                        <a
                          href={`files/${file.cid}`}
                          type="button"
                          className="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Download
                        </a>
                        <button
                        onClick={() => getCar()}
                          type="button"
                          className="ml-3 flex-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          Get CAR
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

/* 交流QQ群:七54573七七八 */