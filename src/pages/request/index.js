
import ListRequest from "@/components/application/request/ListRequest";
import DataRequestForm from "@/components/application/request/RequestForm";
import { useState } from "react";
import Layout from "../Layout";

export default function Request() {
  const [openModal, setOpenModal] = useState(false)

  const changeOpen = (e) => {
    setOpenModal(e)
  }

  //fetch the data. 

  return (
    <Layout title="Request" active="Request">

      <div className="container mx-auto px-4 py-8">
        <div className="flex place-content-end">
          <button
            onClick={() => setOpenModal(!openModal)}
            className="bg-cf-500 hover:bg-cf-700 self-end text-white font-bold py-2 px-4 rounded-full"
          >


            Create Request
          </button>
        </div>
        {openModal && <DataRequestForm />}

        <ListRequest />
      </div>

    </Layout>
  )
}


