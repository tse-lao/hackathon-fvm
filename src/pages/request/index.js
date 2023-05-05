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
    <Layout active="Request">
      <div>
        <h1>Request</h1>

          <main className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
              <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
                <div className="max-w-md mx-auto">
                  <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Open Data Requests</h1>
                  </div>
                  <button
                    onClick={() => setOpenModal(true)}
                    className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white w-16 h-16 rounded-full shadow-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                  <CreateOverlay changeOpen={changeOpen} getOpen={openModal} />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <div className="mt-12">
                    <ListRequest />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
    </Layout>
  )
}
