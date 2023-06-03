import CategoryList from "@/components/application/elements/CategoryList"
import { computation } from "@/constants"
import { useEffect, useState } from "react"

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
export default function JobBountyDetail({jobId}) {
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
  
  
  useEffect(() => {
      console.alert("not yet implemented")
  }, [jobId])
  
  
  const fetchData = async() => {
    setLoading(true)

      let query = `WHERE ${computation}.jobID!='jobID'`;
      
      
      const result = await fetch(`/api/tableland/computation/all?where=${query}`);
      const data = await result.json();
      setData(data.result);
      setLoading(false);
  }
  
  
  
  return (
    <div className="flex flex-col items-center justify-center gap-4">
        <span className="text-xl font-bold mb-2 ">{item.name}</span>
        <span>{item.description}</span>
        <div>
            <CategoryList categories={item.categories} />
        </div>
        <time className="text-gray-600 text-sm">
             {item.endDate.toString()}
        </time>
            
    </div>
  )
}


