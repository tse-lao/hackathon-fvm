import { useContract } from "@/hooks/useContract";
import { grantSmartAccess } from "@/hooks/useLighthouse";
import { runLitProtocol } from "@/hooks/useLitProtocol";
import { useDocument, usePolybase } from "@polybase/react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function GrantAccess({tokenID, metadataCID, address}) {
    const polybase = usePolybase();
    
    const { data, error, loading } = useDocument(polybase.collection("File").where("metadata", "==", metadataCID).where("owner", "==", address) );
    
    const [selectedOptions, setSelectedOptions] = useState([]);
    const {submitData} = useContract();

    if(loading) return <div>Loading...</div>
    if(error) return <div>Error: {error.message}</div>


  
    const handleCheckboxChange = (e) => {
      const checkedValue = e.target.value;
      const isChecked = e.target.checked;
  
      if (isChecked) {
        setSelectedOptions((prevSelectedOptions) => [...prevSelectedOptions, checkedValue]);
      } else {
        setSelectedOptions((prevSelectedOptions) =>
          prevSelectedOptions.filter((option) => option !== checkedValue)
        );
      }
    };

    const provideAcces = async () => {
        //call lighthouse function to provide access based on the porject statistics. 
        const cid = selectedOptions[0];
        
      //for testing recover address only
      //await recoverAddress(cid);
      
        const result = await grantSmartAccess(cid, tokenID, "10001");
        console.log(result)
        
        const litProtocol = await runLitProtocol(cid);
        console.log(litProtocol)
      
      
        if(tokenID < 1 && selectedOptions.length == 1){
            toast.error("Error: By not providing the rights inputs")
        }
       
        
        try{
            await submitData(tokenID, selectedOptions[0], "10000");
            toast.success("Access granted!")
            //also want toa dd to db            
        }catch(e){
            console.log(e)
            toast.error(e.message)
        }
    }
    
  
  return (
    <div>
    <h2>Grant Access</h2>
    
    <div className="mt-2 grid grid-cols-1 gap-4">
    {data.data && data.data.map((item, index) => (
        <label key={index} className="inline-flex items-center hover:bg-cf-100 cursor-pointer">
        <input
          type="checkbox"
          value={item.data.cid}
          checked={selectedOptions.includes(item.data.cid)}
          onChange={handleCheckboxChange}
          className="form-checkbox text-cf-500 rounded-sm"
        />
        <span className="ml-2 text-xs	">{item.data.cid}</span>
        </label>
    ))}
    
    <button 
      className=" 'ml-3 flex-1 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50', mt-2" 
      
    onClick={() => {provideAcces()} }>Provide Access</button>
    </div>
    

    

    
   
    </div>
  )
}
