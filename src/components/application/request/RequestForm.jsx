import { useContract } from "@/hooks/useContract";
import useNftStorage from "@/hooks/useNftStorage";
import { analyzeJSONStructure, readJSONFromFileInput } from "@/lib/dataHelper";
import { useState } from "react";
import TagsInput from "react-tagsinput";
import 'react-tagsinput/react-tagsinput.css';
import { toast } from "react-toastify";
import LoadingSpinner from "../elements/LoadingSpinner";
import { ActionButton } from "../elements/buttons/ActionButton";
import CreateOverlay from "../overlay/CreateOverlay";


export default function DataRequestForm({ onClose, changeOpen, getOpen }) {
  const [formData, setFormData] = useState({
    name: "",
    categories: [],
    description: "This is some dummy description to speed up the process of testing and demoing. ",
    metadata: "",
    minRows: 0,
    requiredRows: 0,
  });
  const [loadingFile, setLoadingFile] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const { RequestDB } = useContract();
  const { uploadMetadata } = useNftStorage();

  const handleTagChange = (tags) => {
    setFormData({ ...formData, categories: tags });
  };

  const uploadMeta = async (e) => {
    setLoadingFile(true);

    const file = e.target.files[0];
    console.log(file)

    if (!file) {
      toast.error("No file selected");
      return;

    }

    readJSONFromFileInput(e.target, async (error, jsonData) => {
      if (error) {
        console.error(error);
      } else {

        const format = analyzeJSONStructure(jsonData);
        const cid = await uploadMetadata(JSON.stringify(format));
        setMetadata(cid);
        setLoadingFile(false);
      }

    });


  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Process the form data and send it to the server or API endpoint.
    console.log(formData);

    if (formData.minRows <= 0) {
      toast.error("You minimum rows must be greater than 0, otherwise you need to create an open Dataset.");
      return;
    }
    
    if(formData.name.length < 3 || formData.name.length > 50, formData.description.length < 25 ){
      toast.error("Please fill out the form correctly, min length name should be 3 and min length description should be 25 characters.");
      return;
    }
    

    
      // Listen for transaction confirmation
 
      toast.promise(RequestDB(
          metadata,
          formData.name,
          formData.description,
          formData.categories,
          formData.requiredRows,
          formData.minRows
        ),
        {
          pending: `Request started for ${formData.name} 🚀`,
          success: `Request ${formData.name} confirmed 🎉`,
          error: `Something went wrong..`,
        }
    ).then(() => {
        changeOpen(false)
        window.location.reload()
    })
    
  }



  return (
<CreateOverlay title="Create a DB Request" onClose={onClose} getOpen={getOpen} changeOpen={changeOpen}>
    <div className="space-y-4">
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
      {loadingFile ? <LoadingSpinner loadingText='uploading metadata' /> :
        metadata ? (
                <div>
                <label htmlFor="requestData" className="block text-md mb-2 font-medium text-gray-700">Preview
              </label>
              <a href={`https://gateway.ipfs.io/ipfs/${metadata}`}
              className="text-indigo-600 hover:text-indigo-500" target="_blank" rel="noreferrer"
              >Click here to see metadata</a>
              <button
                onClick={() => setMetadata(null)}
                
                className="text-red-500"
              >Remove</button>
            </div>
              
              
              ) : (
                <div>
                <label htmlFor="requestData" className="block text-md mb-2 font-medium text-gray-700">
                Upload to get metadata
            </label>
            <input
              type="file"
              name="metadata" id="metadata" onChange={uploadMeta} required
              accept="application/json, application/csv"
            />
          </div>

        )}
        
        <ActionButton  onClick={handleSubmit} loading={loading} text="Submit" />
    </div>
</CreateOverlay>
  );
};
