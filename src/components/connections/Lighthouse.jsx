import { getLighthouse, lighthouseSetup } from "@/lib/createLighthouseApi";
import { usePolybase } from "@polybase/react";
import { useEffect, useState } from "react";

export default function Lighthouse({address}) {
    const polybase = usePolybase();
    
    const [apiExist, setApiExist] = useState(false);
    
    
    useEffect(() => {
        const getApi = async () => {
            const lighthouse = await lighthouseSetup();
          setApiExist(lighthouse);    
        }
        getApi();
    }, [])
    
    

    
    
    
    const createApi = async () => {
      
        const apiKey = await getLighthouse(address);
        console.log(apiKey);
    }
    
  return (
    <div>
        <h2>Lighthouse</h2>
        {apiExist ? <p>API exists</p> : (
          <div>
          <button onClick={createApi}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
          Create API access
          </button>
          
          </div>
          
          )}
    </div>
  )
}
