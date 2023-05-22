import { useCollection, usePolybase } from "@polybase/react";
import { useEffect, useState } from "react";
import DataNotFound from "../application/elements/message/DataNotFound";
import JobItem from "./JobItem";


export default function AllJobs({ dataFormat, performed }) {
  //get all collectionsd
  const polybase = usePolybase();

  const { data, error, loading } =
    useCollection(polybase.collection("Jobs").where("dataFormat", "==", dataFormat));
    const [computations, setComputations] = useState([])

  useEffect(() => {
      if(performed){
        const fetchData = async () => {
            const result = await fetch(`/api/tableland/computations`);
            const status = await result.json();
            console.log(status);
            setComputations(status.result)  
        }
        fetchData()
      }
  }, [performed])
    


  if (loading) { return <p>Loading...</p> }
  if (error) { return <p>Error: {error}</p> }
  
  if(performed){
    return (
      computations.length > 0 && computations.map((computation) => (
        <div>
            {JSON.stringify(computations)}
        </div>
    ))
    );
  }
  return (
    data.data.length > 0 ? data.data.map((job, index) => (
      <JobItem index={job.data.index} details={job.data} key={index} />
    )) : <DataNotFound message="No Jobs found" />
  )
}
