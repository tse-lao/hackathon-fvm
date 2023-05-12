import { DB_main } from "@/constants";
import { useEffect, useState } from "react";
import RequestElement from "./RequestElement";
export default function ListRequest() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    
    useEffect(() => {

        const getData = async() => {
            const url = 'https://testnets.tableland.network/api/v1/query';
            const params = new URLSearchParams({
              statement: `select * from ${DB_main}`
            });
            
            fetch(`${url}?${params.toString()}`, {
              headers: {
                'Accept': 'application/json'
              }
            })
              .then(response => response.json())
              .then(data => {
                if(data != "Row not found"){
                  setData(data)
                  console.log(data);
                }
               
                setLoading(false);
            })
              .catch(error => console.error(error));
              
           
        }
        
        getData();
    }, [])
    
      
    
    if(loading) return <div>Loading...</div>
    return (
        <div>
            {data.length > 0 ? data.map((request, index) => (
                <RequestElement index={index} request={request} key={index} />
            )): (<p>No data found!</p>)}
            

        </div>
   
        
    )
}
