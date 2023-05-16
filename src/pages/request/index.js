
import CreateOverlay from "@/components/application/overlay/CreateOverlay";
import ListRequest from "@/components/application/request/ListRequest";
import { useState } from "react";
import Layout from "../Layout";



const requests = [
  {
    id: 1,
    title: "Population Data",
    description: "Request for population data of major cities in the US.",
    name: "John Doe",
    createdAt: "2023-05-01T10:30:00.000Z",
  },
  {
    id: 2,
    title: "Weather Data",
    description: "Request for historical weather data for the past 10 years.",
    name: "Jane Smith",
    createdAt: "2023-05-02T12:45:00.000Z",
  },
  {
    id: 3,
    title: "Traffic Data",
    description: "Request for real-time traffic data for San Francisco.",
    name: "Michael Johnson",
    createdAt: "2023-05-03T15:20:00.000Z",
  },
  {
    id: 4,
    title: "Public Transport Data",
    description: "Request for public transport routes and schedules in New York City.",
    name: "Emily Brown",
    createdAt: "2023-05-04T09:15:00.000Z",
  },
];

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
      onClick={() => setOpenModal(true)}
      className="bg-indigo-500 hover:bg-indigo-700 self-end text-white font-bold py-2 px-4 rounded-full"
    >
      <CreateOverlay changeOpen={changeOpen} getOpen={openModal} />

      Create Request
    </button>
      </div>
      
        <ListRequest />
      </div>

    </Layout>
  )
}


