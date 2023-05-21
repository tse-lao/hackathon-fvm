import { useCollection, usePolybase } from "@polybase/react";
import JobItem from "./JobItem";

export default function AllJobs({ dataFormat }) {
  //get all collectionsd
  const polybase = usePolybase();

  const { data, error, loading } =
    useCollection(polybase.collection("Jobs").where("dataFormat", "==", dataFormat));



  if (loading) { return <p>Loading...</p> }
  if (error) { return <p>Error: {error}</p> }

  return (

    data.data.length > 0 ? data.data.map((job, index) => (
      <JobItem index={job.data.index} details={job.data} key={index} />
    )) : (<p>No data found!</p>)
  )
}
