import PageTitle from "@/components/application/elements/text/PageTitle";
import AddJobRequest from "@/components/jobs/request/CreateJobRequestBounty";
import JobBounties from "@/components/jobs/request/JobBounties";
import Layout from "../Layout";

export default function RequestPlace() {
  return (
    <Layout>
      <div className="flex justify-between m-8 mb-12">
        <PageTitle title="Job Requests" />
        <AddJobRequest />
      </div>

        <JobBounties />
    </Layout>    
  )
}
