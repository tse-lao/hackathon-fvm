import DataNotFound from "@/components/application/elements/message/DataNotFound";
import RequestElement from "@/components/application/request/RequestElement";
import { DB_attribute, DB_main } from "@/constants";
import { useEffect, useState } from "react";


export default function GroupDataRequest({address}) {
    const [data, setData] = useState([])
    useEffect(() => {
        const getData = async() => {
            let query = `WHERE ${DB_main}.piece_cid='piece_cid' AND
            ${DB_attribute}.trait_type='creator' AND  ${DB_attribute}.value = '${address.toLowerCase()}'

            `;
            
            
            const res = await fetch(`/api/tableland/token/all?where=${query}`)
            const result = await res.json()
            console.log(result)
            setData(result.result);

        } 
        
        getData()
    }, [address])
    
    
  return (
    <div className="grid grid-cols-1 gap-6">
    {data.length > 0 ? data.map((request, index) => (
        <RequestElement index={index} request={request} key={index} />
    )) : (<DataNotFound message="No Request"/>)}
</div>
    
  )
}
