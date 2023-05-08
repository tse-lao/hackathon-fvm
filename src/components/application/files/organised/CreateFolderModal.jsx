import ModalLayout from '@/components/ModalLayout';
import { useAuth, usePolybase } from "@polybase/react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function CreateFolderModal({changeOpenModal}) {
    const [formData, setFormData] = useState({
        name: "",
      });
      const {auth, state, loading} = useAuth();
  
      const polybase = usePolybase();
  
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const createFolder = async(e) => {
        e.preventDefault();
        // Process the form data and send it to the server or API endpoint.
        console.log(formData);
        
        
       console.log(state);
        const requestId = uuidv4();
        
        const requestTime = new Date().toISOString();
        
        const parentID = ""
        
        const collection = await polybase.collection("Folder").create([
          requestId,
          formData.name,
          requestTime,
          parentID
        ])
        
        console.log(collection)
        
        if(collection.data){
            changeOpenModal();
        }
      };
  
    return (
        <ModalLayout onClose={changeOpenModal}>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Folder Name</label>
                    <input type="text" 
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                    className="border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </div>
                <div className="flex flex-col gap-2">
                    <button name="Create folder"
                        onClick={createFolder}
                        >
                        Create folder
                        </button>
                </div>
            </div>
        </ModalLayout>
    )
}
