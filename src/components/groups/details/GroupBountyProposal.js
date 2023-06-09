import JobList from "@/components/jobs/JobList";
import JobBounties from "@/components/jobs/request/JobBounties";
import { useEffect, useState } from "react";



export default function GroupBountyProposal({address}) {
  const [request, setRequest] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  
  
  
  useEffect(() => {
    /// 
    const getData = async () => {
      setLoading(true)

      let query = ``;

      if(address){
        query += ` WHERE creator='${address}'`
      }
      //TODO: add filters later or maybe one search bar. 

      const computations = await fetch(`/api/tableland/jobs/all?where=${query}`);
      const data = await computations.json();

      console.log(data.result)
      setJobs(data.result)

      setLoading(false)
  }

  getData();

  }, [address])
  
  
  return (    
    <div>
        <div className="grid grid-cols-2 text-center mb-4">
          <span onClick={() => setRequest(false)} className={`${!request && 'text-cf-500'}`}>Jobs</span>
          <span onClick={() => setRequest(true)} className={`${request && 'text-cf-500'}`}>Request</span>
        </div>
        
        {request ?  <JobBounties address={address} /> :  <JobList jobs={jobs} />}
        
        
       
    </div>
  )
}
