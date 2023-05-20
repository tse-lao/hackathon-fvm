import { useState } from "react";
import SettingsLayout from "./SettingsLayout";

const connections = [
    {
        id: 1,
        name: "Facebook",
        status: "logged_in",
        category: "social_media",
    },
    {
        id: 2,
        name: "Google",
        status: "logged_out",
        category: "social_media",
    },
    {
        id: 3,
        name: "Fitbit",
        status: "not_connected",
        category: "health",
    },
    {
        id: 4,
        name: "MyBank",
        status: "logged_in",
        category: "banking",
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
        <SettingsLayout active="Connections">
        <main className="divide-y divide-gray-200 lg:col-span-9 py-6 flex flex-col justify-center sm:py-12">

        <div className="relative py-3 sm:max-w-xl sm:mx-auto">

            <div className="mx-auto">
              <div className="text-center mb-6">
                {/* Filter */}
                <div className="mt-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {filteredConnections.map((connection) => (
                  <div
                    key={connection.id}
                    className="p-4 bg-white rounded-lg shadow-md border border-gray-200"
                  >
                    {connection.component ?
                    connection.component :
                (
                    <div>
                    <h2 className="text-xl font-semibold mb-2">{connection.name}</h2>
                    <p className="text-gray-600">Status: {connection.status.replace("_", " ")}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Category: {categories.find((category) => category.value === connection.category).label}
                    </p>
                    </div>
                )}
                  
                  </div>
                ))}
       
              </div>
            </div>
        </div>
      </main>
          
        </SettingsLayout>
    )
}
