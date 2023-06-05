import DataNotFound from "../application/elements/message/DataNotFound";
import JobItem from "./JobItem";


export default function JobList({ jobs }) {
  //get all collectionsd

  return (
    jobs.length > 0 ? jobs.map((job, index) => (
      <JobItem index={job.index} details={job} key={index} />
    )) : <DataNotFound message="No Jobs found" />
  )
}
