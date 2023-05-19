import { useEffect, useState } from "react";
import LoadingIcon from "../elements/loading/LoadingIcon";
import Filters from "../overlay/Filters";
import RequestElement from "./RequestElement";

export default function ListRequest() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {

        const getData = async() => {
          setLoading(true)
          const result = await fetch(`/api/tableland/token/all?request=false`);
          const data = await result.json()
          setData(data.result)
          
          setLoading(false)
        }
        
        getData();
    }, [])
    
      
    if(loading) return <LoadingIcon />
    return (
      <div className="flex flex-col">      
      <Filters name="Data Requests"/>


      <main className="flex-1">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-col-3 gap-6">
            {data.length > 0 ? data.map((request, index) => (
                <RequestElement index={index} request={request} key={index} />
            )): (<p>No data found!</p>)}
            

        </div>
        </main>
        </div>
   
        
    )
}
