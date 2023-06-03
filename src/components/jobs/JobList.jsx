import DataNotFound from "../application/elements/message/DataNotFound";
import JobItem from "./JobItem";


export default function JobList({ jobs }) {
  //get all collectionsd
  
  jobs = [{
    id: '1', 
    name: 'Random Job Name', 
    description: 'another random descripotion of the job. This will be only 1024 characters long. '
  }, 
  {
    id: '1', 
    name: 'Random Job Name', 
    description: 'another random descripotion of the job. This will be only 1024 characters long. '
  }, 
  {
    id: '1', 
    name: 'Random Job Name', 
    description: 'another random descripotion of the job. This will be only 1024 characters long. '
  }, 
  {
    id: '1', 
    name: 'Random Job Name', 
    description: 'another random descripotion of the job. This will be only 1024 characters long. '
  }]
  return (
    jobs.length > 0 ? jobs.map((job, index) => (
      <JobItem index={job.index} details={job} key={index} />
    )) : <DataNotFound message="No Jobs found" />
  )
}
