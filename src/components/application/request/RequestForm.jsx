import { useContract } from "@/hooks/useContract";
import useNftStorage from "@/hooks/useNftStorage";
import { analyzeJSONStructure, readJSONFromFileInput } from "@/lib/dataHelper";
import { useAuth, usePolybase } from "@polybase/react";
import { useState } from "react";
import TagsInput from "react-tagsinput";
import 'react-tagsinput/react-tagsinput.css';
import { toast } from "react-toastify";


export default function DataRequestForm  ({onClose}) {
    const [formData, setFormData] = useState({
      name: "",
      categories: [],
      description: "",
      metadata: "",
      minRows: 0,
      requiredRows: 0, 
    });
    
    const [metadata, setMetadata] = useState(null);
    const {auth, state, loading} = useAuth();

    const polybase = usePolybase();
    const {RequestDB} = useContract();
    const {uploadMetadata}= useNftStorage();

    const handleTagChange = (tags) => {
      setFormData({ ...formData, categories: tags });
    };

    const uploadMeta = async(e) => {
      const file = e.target.files[0];

      readJSONFromFileInput(e.target, async(error, jsonData) => {
        if (error) {
          console.error(error);
        } else {
          console.log(jsonData);
          const format = analyzeJSONStructure(jsonData);
          console.log(format);
          const cid = await uploadMetadata(JSON.stringify(format));
          setMetadata(cid);
          
          console.log(cid);
        }
      });
      

    }
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async(e) => {
      e.preventDefault();
      // Process the form data and send it to the server or API endpoint.
      console.log(formData);
      
      if(formData.minRows <= 0){
        toast.error("Min rows is invalid");
      }
      
      try{
       //    const RequestDB = async( dataFormatCID: string, DBname: string, description: string, categories: string[], requiredRows: number, minimumRowsOnSubmission:number) => {
        await RequestDB(metadata, formData.name, formData.description,formData.categories,  formData.requiredRows, formData.minRows);
      }catch(e){
        console.log(e);
        toast.error("Error creating request");
      }

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
          <TagsInput value={formData.categories} onChange={handleTagChange} />
        </div>
        <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Min rows
        </label>
        <input
          type="number"
          name="minRows"
          id="minRows"
          value={formData.minRows}
          onChange={handleChange}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
        Required Rows
      </label>
      <input
        type="number"
        name="requiredRows"
        id="requiredRows"
        value={formData.requiredRows}
        onChange={handleChange}
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
      <div>
      <label htmlFor="requestData" className="block text-sm font-medium text-gray-700">
        Description
      </label>
      <textarea
        name="description"
        id="description"
        rows="3"
        value={formData.description}
        onChange={handleChange}
        required
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      ></textarea>
    </div>
        <div>
          <label htmlFor="requestData" className="block text-sm font-medium text-gray-700">
            Metadata Request
          </label>
          <input 
            type="file" 
            name="metadata" id="metadata" onChange={uploadMeta} required
            accept="application/json, application/csv"
            />
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
  