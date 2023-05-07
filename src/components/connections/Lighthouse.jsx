import { useAuth, usePolybase } from "@polybase/react";
import { useEffect, useState } from "react";

export default function Lighthouse() {
    const polybase = usePolybase();
    const { state, loading } = useAuth();
    const [status, setStatus] = useState("not loggedin");

    useEffect(() => {
        if(!state) { 
            setStatus("not loggedin"); 
            return; 
        }
        console.log(state.publicKey);
        
        const getProfile = async(key) => {
            try{
                const getProfile =  await polybase.collection("Profile").record(state.publicKey).get();
                console.log(getProfile)
                
                if(getProfile.data){
                    setStatus("logged in");
                    console.log(getProfile.data.connections);
                    if(getProfile.data.connections === undefined){
                        setStatus("no_connections")
                        
                        //now we want to create something 
                        try{
                            const createProfile = await polybase.collection("Profile").record(state.publicKey).create({
                                connections: []
                            });
                            console.log(createProfile)
                    }catch(e){
                        console.log(e)
                        setStatus("error_creating_profile")
                       
                    }
                }
            }
            }catch(e){
                console.log(e)
                setStatus("no_profile")
               
            }
        }
        getProfile(state.publicKey);
    }, [state])
    
    
    if (loading) return <p>Loading...</p>;
    
    
    
    
    
  return (
    <div>
        <h2>Lighthouse</h2>
        <p>{status}</p>
    </div>
  )
}
