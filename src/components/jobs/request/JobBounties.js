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

export default function JobBounties() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
      //get all the bounties here.. 
      window.alert("not yet implemented")
  }, [])
  
  const fetchJobBounties = async() => {
    setLoading(true);
    
    //TODO: this needs to be implemented
    const result = await fetch(`/api/tableland/jobs/all`);
    const res = result.json();
    setData(res.data);
    setLoading(false)
    
  }
  
  
  if(loading) return <LoadingEmpty />
  return (
    <div>
        {requests.length > 0 && requests.map((item, key ) => (
          <JobBountyItem details={item} key={key} />
        ))}
    </div>
    
  
  )
}
