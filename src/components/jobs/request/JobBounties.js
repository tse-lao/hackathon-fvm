import LoadingEmpty from "@/components/application/elements/loading/LoadingEmpty"
import { useEffect, useState } from "react"
import JobBountyItem from "./JobBountyItem"

const requests = [
  {
    id: 1,
    name: "First Request",
    description: "Lopsem Some random data for testing how it will look in the ui. ",
    categories: ["new category", "category2", "category4"], 
    resources: ["Qmskldfjsdiowerwepr20mfsd", "Qmksldfj03msdkflsdf"], 
    minReward: 10,
    contributors: 10, 
    endDate: new Date(), 
    status: 1, 
  }, 
  {
    id: 1,
    name: "First Request",
    description: "Lopsem Some random data for testing how it will look in the ui. ",
    categories: ["new category", "category2", "category4"], 
    resources: ["Qmskldfjsdiowerwepr20mfsd", "Qmksldfj03msdkflsdf"], 
    minReward: 10,
    contributors: 10, 
    endDate: new Date(), 
    status: 1, 
  },
  {
    id: 1,
    name: "First Request",
    description: "Lopsem Some random data for testing how it will look in the ui. ",
    categories: ["new category", "category2", "category4"], 
    resources: ["Qmskldfjsdiowerwepr20mfsd", "Qmksldfj03msdkflsdf"], 
    minReward: 10,
    contributors: 10, 
    endDate: new Date(), 
    status: 1, 
  } ,
  {
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
]

export default function JobBounties({address}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
      fetchJobBounties();
  }, [])
  
  const fetchJobBounties = async() => {
    setLoading(true);
    
    
    let query = `WHERE winner='undefined'`
    
    if(address){
      query += ` AND creator='${address}'`
    }
    
    const result = await fetch(`/api/tableland/bounty/all?where=${query}`);
    const res = await  result.json();
    console.log(res.result)
    
    if(res.result.length > 0) {
      setData(res.result);
    }
    //setData(res.data);
    setLoading(false)
    
  }
  
  
  if(loading) return <LoadingEmpty />
  return (
    <div className="grid lg:grid-cols-2 sm:grid-cols-1 flex-col justify-center">
    {data.length > 0 && data.map((item, key ) => (
          <JobBountyItem details={item} key={key} />
        ))}
    </div>
    
  
  )
}
