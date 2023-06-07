import { usePolybase } from "@polybase/react";
import { ethers } from "ethers";
import InputField from "../application/elements/input/InputField";

export default function SearchMember({addMember}) {
    
    const db = usePolybase();
    
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
        }
        
        
    }
    
  return (
    <InputField 
                type="text" 
                placeholder="Enter username or address" 
                name="search"  
                id="search"
                onEnter={getUsername}
            />
  )
}
