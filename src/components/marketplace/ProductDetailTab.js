import { Tab } from "@headlessui/react"
import { Fragment } from "react"
import Contributions from "../application/data/Contributions"
import AllComputations from "../jobs/AllComputations"
import ComputationalOverview from "../jobs/ComputationalOverview"
import AllTokenHolders from "./token/AllTokenHolders"
  
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  
export default function ProductDetailTab({tokenID, dataFormat, dbCID}) {
  
  return (
    <Tab.Group as="div">
    <div className="border-b border-gray-200">
      <Tab.List className="-mb-px flex space-x-8">
        <Tab
          className={({ selected }) =>
            classNames(
              selected
                ? 'border-cf-600 text-cf-600'
                : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800',
              'whitespace-nowrap border-b-2 py-6 text-sm font-medium'
            )
          }
        >
          Data Contributors
        </Tab>
        <Tab
          className={({ selected }) =>
            classNames(
              selected
                ? 'border-cf-600 text-cf-600'
                : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800',
              'whitespace-nowrap border-b-2 py-6 text-sm font-medium'
            )
          }
        >
          Computation Optionss
        </Tab>
        <Tab
          className={({ selected }) =>
            classNames(
              selected
                ? 'border-cf-600 text-cf-600'
                : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800',
              'whitespace-nowrap border-b-2 py-6 text-sm font-medium'
            )
          }
        >
          Token Holders
        </Tab>
        <Tab
        className={({ selected }) =>
          classNames(
            selected
              ? 'border-cf-600 text-cf-600'
              : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800',
            'whitespace-nowrap border-b-2 py-6 text-sm font-medium'
          )
        }
      >
        Performed Computations
      </Tab>
      
      </Tab.List>
    </div>
    <Tab.Panels as={Fragment} >
      <Tab.Panel className="-mb-10 bg-white rounded-lg mt-5 max-h-[500px] overflow-auto" >
        <h3 className="sr-only">Contributors</h3>
        <Contributions tokenID={tokenID} />
      </Tab.Panel>  
    <Tab.Panel className="pt-10">
      <h3 className="sr-only">Computation Overview</h3>
      <div className="prose prose-sm max-w-none text-gray-500">
        <ComputationalOverview tokenID={tokenID} dataFormat={dataFormat}/>
      </div>
    </Tab.Panel>
      <Tab.Panel className="pt-10">
        <h3 className="sr-only">Token Holders</h3>
        <AllTokenHolders tokenID={tokenID}/>
      </Tab.Panel>
      <Tab.Panel className="pt-10">
      <h3 className="sr-only">Performed</h3>
      <AllComputations dbCID={dbCID} input={dataFormat}/>
      </Tab.Panel>
    </Tab.Panels>
  </Tab.Group>
  )
}
