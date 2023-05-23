import Link from "next/link";
import { useState } from "react";
import Layout from "../Layout";
const connections = [
    {
        id: 1,
        name: "Strava",
        status: "ready ",
        category: "health",
    },
    {
        id: 2,
        name: "Facebook",
        status: "coming soon",
        category: "social_media",
    },
    {
        id: 3,
        name: "Twitter",
        status: "coming soon",
        category: "social_media",
    },
    {
        id: 4,
        name: "Spotify",
        status: "coming soon",
        category: "social_media",
    },
    {
        id: 5,
        name: "Netflix",
        status: "coming soon",
        category: "social_media",
    },
    {
        id: 6,
        name: "Google",
        status: "coming soon",
        category: "social_media",
    },

];


const categories = [
    { value: "all", label: "All" },
    { value: "social_media", label: "Social Media" },
    { value: "health", label: "Health" },
    { value: "banking", label: "Banking" },
];

export default function Connections() {
    const [selectedCategory, setSelectedCategory] = useState("all");

    const filteredConnections = connections.filter((connection) => {
        return selectedCategory === "all" || connection.category === selectedCategory;
    });

    return (
      <Layout active="Connections">
          <main className="min-h-screen py-6 flex flex-col  sm:py-12">
              <div className="px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center mb-6">
                      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
  
                      {/* Filter */}
                      <div className="w-64">
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="category">
                          Filter by category
                      </label>
                      <select
                          id="category"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:shadow-outline"
                      >
                          {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                              {category.label}
                          </option>
                          ))}
                      </select>
                      </div>
                  </div>
  
                  {/* Connections */}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
                      {filteredConnections.map((connection) => (
                        <Link key={connection.id} href={connection.status == 'coming soon' ? '#' : `/connections/${connection.name.toLowerCase()}`}>

                      <div
                          key={connection.id}
                          className="p-4 bg-white rounded-lg shadow-md border border-gray-200 cursor-pointer hover:bg-cf-100"
                      >
                          {connection.component ?
                          connection.component :
                      (
                          <div>
                          <h2 className="text-lg font-medium mb-2 text-gray-700 overflow-hidden overflow-ellipsis whitespace-nowrap">{connection.name}</h2>
                          <p className={`text-gray-600 ${connection.status == 'ready' && 'text-cf-600'}`}>Status: {connection.status.replace("_", " ")}</p>
                          <p className="text-sm text-gray-400 mt-2">
                              Category: {categories.find((category) => category.value === connection.category).label}
                          </p>
                          </div>
                      )}
                      
                      </div>
                        </Link>
                      ))}
              
                  </div>
              </div>
          </main>
      </Layout>
  )
  
  
}
