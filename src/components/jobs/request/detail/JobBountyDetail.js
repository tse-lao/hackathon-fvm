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
export default function JobBountyDetail({jobId, details}) {
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
    <div className="flex flex-col items-center justify-center gap-4">
        <span className="text-xl font-bold mb-2 ">{details.name}</span>
        <span>{details.description}</span>
        
        <span>Group address</span>
            
    </div>
  )
}


