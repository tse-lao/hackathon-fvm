import { useAuth, usePolybase } from "@polybase/react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";


export default function DataRequestForm  ({onClose}) {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      metadata: ""
    });
    const {auth, state, loading} = useAuth();

    const polybase = usePolybase();

  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async(e) => {
      e.preventDefault();
      // Process the form data and send it to the server or API endpoint.
      console.log(formData);
      
      
     console.log(state);
      const requestId = uuidv4();
      
      const requestTime = new Date().toISOString();
      
      const collection = await polybase.collection("DataRequest").create([
        requestId,
        formData.name,
        formData.metadata,
        true, 
         false, 
         requestTime
      ])
      
      console.log(collection)
    };

    return (

        <div  className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            name="category"
            id="category"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="requestData" className="block text-sm font-medium text-gray-700">
            Metadata Request
          </label>
          <textarea
            name="metadata"
            id="metadata"
            rows="3"
            value={formData.requestData}
            onChange={handleChange}
            required
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </div>
      
    );
  };
  