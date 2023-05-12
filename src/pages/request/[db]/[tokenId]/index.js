import { readFileFromIPFS } from "@/hooks/useIPFS";
import { useTableland } from "@/hooks/useTableland";
import Layout from "@/pages/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Contributions from "@/components/application/data/Contributions";
import GrantAccess from "@/components/application/request/GrantAccess";
import {
  CheckIcon,
  HandThumbUpIcon,
  UserIcon
} from '@heroicons/react/20/solid';
import { useAccount } from "wagmi";


const eventTypes = {
  applied: { icon: UserIcon, bgColorClass: 'bg-gray-400' },
  advanced: { icon: HandThumbUpIcon, bgColorClass: 'bg-blue-500' },
  completed: { icon: CheckIcon, bgColorClass: 'bg-green-500' },
}
const timeline = [
  {
    id: 1,
    type: eventTypes.applied,
    content: 'Revoked access to dataset by',
    target: '0x213480',
    date: 'Sep 23',
    datetime: '2023-09-20',
  },
  {
    id: 2,
    type: eventTypes.advanced,
    content: 'Data contribution by ',
    target: '0x213480',
    date: 'Sep 22',
    datetime: '2023-09-22',
  },
  {
    id: 3,
    type: eventTypes.completed,
    content: 'Creation of new dataset by',
    target: 'Creator',
    date: 'Sep 28',
    datetime: '2020-09-28',
  },
  {
    id: 4,
    type: eventTypes.advanced,
    content: 'Data contribution by ',
    target: '0x213480',
    date: 'Sep 30',
    datetime: '2020-09-30',
  },
  {
    id: 5,
    type: eventTypes.completed,
    content: 'Creation of new dataset by',
    target: 'Creator',
    date: 'Oct 4',
    datetime: '2020-10-04',
  },
]


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function GetRequestDetails() {
    const router = useRouter();
    const {fetchTokenRequest, fetchDataSubmission} = useTableland();
    const { db, tokenId } = router.query;
    const [loading, setLoading] = useState(true);
    const [metadata, setMetadata] = useState(null);
    const {address} = useAccount();
    const [data, setData] = useState(null);
    const [showGrant, setShowGrant] = useState(false);

        useEffect(() => {
            const getMetadata = async(cid) => {
                const metaResponse = await readFileFromIPFS(cid);
                console.log(metaResponse);
                setMetadata(metaResponse);
            }
            const getData = async() => {
                const response = await fetchTokenRequest(tokenId);
                // /console.log(response[0]);
                console.log(response[0]);
                setData(response[0])
                
                if(response[0].dataFormatCID){
                    
                    getMetadata(response[0].dataFormatCID);
                }

                
                //we also want to read the file 
            }
            
          
            if(db && tokenId){getData(); setLoading(false)};
        }, [db, tokenId])


    
    return (
        <Layout title="Request">
   


        <main className="py-10">
          {/* Page header */}
          <div className="mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
            <div className="flex items-center space-x-5">
             
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{db}</h1>
                <p className="text-sm font-medium text-gray-500">
                  {tokenId}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
             
              <button
                type="button"
                onClick={() => setShowGrant(!showGrant)}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Create new Data Set
              </button>
            </div>
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2 lg:col-start-1">
              {/* Description list*/}
              
              {data && (
                <section aria-labelledby="applicant-information-title">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h2 id="applicant-information-title" className="text-lg font-medium leading-6 text-gray-900">
                      {data.dbName} - {data.tokenID}
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Find here an overview of all the requested data.</p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Categories</dt>
                        <dd className="mt-1 text-sm text-gray-900"></dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Min rows required</dt>
                        <dd className="mt-1 text-sm text-gray-900">{data.minimumRowsOnSubmission}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Metadata Format</dt>
                        <dd className="mt-1 text-sm text-gray-900 overflow-scroll">{data.dataFormatCID}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Submit before</dt>
                        <dd className="mt-1 text-sm text-gray-900">now..</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Description</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                        {data.description}
                        </dd>
                      </div>

                    </dl>
                  </div>

                </div>
              </section>
              )}
              

              {/* Comments*/}
              <section aria-labelledby="notes-title">
                <div className="bg-white shadow sm:overflow-hidden sm:rounded-lg">
                  <div className="divide-y divide-gray-200">
                    <div className="px-4 py-5 sm:px-6">
                      <h2 id="notes-title" className="text-lg font-medium text-gray-900">
                        Contributions
                      </h2>
                    </div>
                    <div className="px-4 py-6 sm:px-6">
                        {data && (<Contributions tokenID={data.tokenID}/>)}
                    </div>
                  </div>

                </div>
              </section>
            </div>

            <section aria-labelledby="timeline-title" className="lg:col-span-1 lg:col-start-3">
            <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
            {showGrant ? (
                <GrantAccess tokenID={data.tokenID} setShowGrant={setShowGrant} address={address}/>
            ): (
                <div>
                <h2 id="timeline-title" className="text-lg font-medium text-gray-900">
                  Contract Interactions
                </h2>

                {/* Activity Feed */}
                <div className="mt-6 flow-root">
                  <ul role="list" className="-mb-8">
                    {timeline.map((item, itemIdx) => (
                      <li key={item.id}>
                        <div className="relative pb-8">
                          {itemIdx !== timeline.length - 1 ? (
                            <span
                              className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span
                                className={classNames(
                                  item.type.bgColorClass,
                                  'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
                                )}
                              >
                                <item.type.icon className="h-5 w-5 text-white" aria-hidden="true" />
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm text-gray-500">
                                  {item.content}{' '}
                                  <a href="#" className="font-medium text-gray-900">
                                    {item.target}
                                  </a>
                                </p>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                <time dateTime={item.datetime}>{item.date}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 flex flex-col justify-stretch">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Display all interactions
                  </button>
                </div>
              </div>
            )}
            </div>
             
            </section>
          </div>
        </main>
                

        </Layout>

    )
}
