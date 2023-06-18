import Table from "@/components/application/data/Table";
import LoadingEmpty from "@/components/application/elements/loading/LoadingEmpty";
import DataNotFound from "@/components/application/elements/message/DataNotFound";
import { useEffect, useState } from "react";

export default function GroupDeals({address}) {
        const [data, setData]= useState([])
        const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const getData = async () => {
          
          //filter out the correct data and display it 
            const fetched = await fetch(`/api/tableland/multisig/deals?multiSig='${address}'`);
            const result = await fetched.json();
            console.log(result);
            setData(result.result)
            
        }
        
        if(address){
            
            getData()
        }
        
    }, [address])
    
    if(loading) return <LoadingEmpty />
  return (
    data.length > 0 ?(
      <DataNotFound message="No deals yet. " />
    ) : (
      <Table data={data}/>
    )
    
    
      
  )
}
