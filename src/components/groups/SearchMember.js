import { usePolybase } from "@polybase/react";
import { ethers } from "ethers";
import { useState } from "react";
import InputField from "../application/elements/input/InputField";

export default function SearchMember({addMember}) {
    const db = usePolybase();
    const [valid, setValid] = useState(false);
    const [message, setMessage] = useState("");
    
    async function getUsername(searchInput){
        const records = await db.collection("Profile").where("name", "==", searchInput).get();
       
        
        if(records.data === null){
            const { data, cursor } = records;
            console.log(data); 
            console.log(data[0].data.id);
            console.log(ethers.utils.computeAddress());
        }
       
        //check if its a valid address
        if(ethers.utils.isAddress(searchInput)){
            addMember(searchInput);
            setValid(true);
            setMessage(`Please fill out the form to add ${searchInput} to the multisig`)
            return;
        }
        
        setMessage("This is not a valid address")
        setValid(false);
        
        
    }
    
  return (
    <div>
        <InputField 
        type="text" 
        placeholder="Enter username or address" 
        name="search"  
        id="search"
        className="outline outline-cf-500"
        onEnter={getUsername}
    />
    {message && <span className={`${valid ? 'text-cf-500' : 'text-red-500'}`}>{message}</span>}
    
    </div>

  )
}
