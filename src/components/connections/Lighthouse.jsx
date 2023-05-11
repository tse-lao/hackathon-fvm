import { createApiKey, getLighthouse } from "@/lib/createLighthouseApi";
import { useEffect, useState } from "react";
import Connected from "../application/elements/Connected";

export default function Lighthouse({address}) {
  
    
    const [apiExist, setApiExist] = useState(false);
    
    
    useEffect(() => {
        const getApi = async () => {
            const lighthouse = await getLighthouse(address);
            console.log(lighthouse)
            if (!lighthouse) {
                setApiExist(false);
            }else{
                setApiExist(true);
            }
        }
        getApi();
    }, [])
    
    const createApi = async () => {
      const create = await createApiKey(address);
      console.log(create);
    }
    
    
  return <Connected connected={apiExist} msg="Lighthouse API" handleConnect={createApi}/>
}
