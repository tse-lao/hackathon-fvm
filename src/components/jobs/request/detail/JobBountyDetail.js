import { DocumentMagnifyingGlassIcon, UserIcon, WalletIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

//TODO: iplement later
const item = {
  id: 1,
  name: "First Request",
  description: "Lopsem Some random data for testing how it will look in the ui. ",
  categories: ["new category", "category2", "category4"],
  resources: ["Qmskldfjsdiowerwepr20mfsd", "Qmksldfj03msdkflsdf"],
  minReward: 10,
  contributors: 10,
  endDate: new Date(),
  status: 1,
}
export default function JobBountyDetail({ jobId, details }) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    id: 1,
    name: "Dummy Data Still.. Request",
    description: "Lopsem Some random data for testing how it will look in the ui. ",
    categories: ["new category", "category2", "category4"],
    resources: ["Qmskldfjsdiowerwepr20mfsd", "Qmksldfj03msdkflsdf"],
    minReward: 10,
    contributors: 10,
    endDate: new Date(),
    status: 1,
  })





  return (
    <div className="grid grid-cols-8  items-center justify-center gap-4">
      <span className="col-span-8 text-xl font-bold mb-2 ">{details.name}</span>
      <span className="col-span-8 text-gray-700" >{details.description}</span>

      <div className="col-span-1">
        <UserIcon height={16} />
      </div>
      <div className="col-span-7">
        {details.creator}
      </div>

      <div className="col-span-1">
        <WalletIcon height={16} />
      </div>
      <div className="col-span-7">
        {details.reward / 10 ** 18}
      </div>

      <div className="col-span-1">
        <DocumentMagnifyingGlassIcon height={16} />
      </div>
      <div className="col-span-7">
        {details.dataFormat}
      </div>

    </div>
  )
}


