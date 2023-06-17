import CreateJobRequestBountyModal from "@/components/jobs/request/CreateJobRequestBountyModal";
import JobBounties from "@/components/jobs/request/JobBounties";
import Link from "next/link";
import { useState } from "react";
import Layout from "../Layout";
export default function RequestPlace() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <Layout active="Jobs">


      {modalOpen ? <CreateJobRequestBountyModal getOpen={modalOpen} onClose={() => { setModalOpen(!modalOpen); console.log(!modalOpen) }} />
        : (
          <div>

            <div className="grid grid-cols-2 text-center mb-4">
              <Link className="col-span-1" href="/jobs" >Verified Jobs</Link>
              <Link className="col-span-1 text-cf-500 font-md" href="/jobs/request">Jobs Request</Link>
            </div>
            <JobBounties />
          </div>
        )

      }

      <button
        className="fixed bottom-12 right-12 bg-cf-500 text-white px-4 py-2 rounded"
        onClick={() => { setModalOpen(!modalOpen); console.log(!modalOpen) }}
      >
        Create Request
      </button>

    </Layout>
  )
}
