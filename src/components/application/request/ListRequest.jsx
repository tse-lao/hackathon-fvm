import { getAllNFTs } from "@/hooks/useTableland";
import { useEffect, useState } from "react";
import Filters from "../overlay/Filters";
import RequestElement from "./RequestElement";

export default function ListRequest() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {

        const getData = async() => {
          const dataSets = await getAllNFTs(false);
          setData(dataSets)
        }
        
        getData();
    }, [])
    
      
    
    return (
      <div className="flex flex-col">      
      <Filters name="Data Requests"/>


      <main className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.length > 0 ? data.map((request, index) => (
                <RequestElement index={index} request={request} key={index} />
            )): (<p>No data found!</p>)}
            

        </div>
        </main>
        </div>
   
        
    )
}
