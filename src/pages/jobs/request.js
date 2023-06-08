import AddJobRequest from "@/components/jobs/request/CreateJobRequestBounty";
import JobBounties from "@/components/jobs/request/JobBounties";
import Link from "next/link";
import Layout from "../Layout";
export default function RequestPlace() {
  return (
    <Layout>
    <div className="grid grid-cols-2 text-center">
    <Link className="col-span-1" href="/jobs" >Verified Jobs</Link>
    <Link className="col-span-1" href="/jobs/request">Jobs Request</Link>
  </div>
      <div className="flex justify-between m-8 mb-12">
      
       
      </div>
      <AddJobRequest />

      <JobBounties />
    </Layout>
  )
}
