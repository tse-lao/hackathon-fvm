import { useCollection, usePolybase } from "@polybase/react";
import RequestElement from "./RequestElement";

export default function ListRequest() {
    const polybase = usePolybase();
    const { data, error, loading } =
      useCollection(polybase.collection("DataRequest"));

      
    
    if(loading) return <p>Loading...</p>
    
    if(error) return <p>Error: {error.message}</p>
    
    
    return (
        <div>
            {data && data.data.map((request) => (
                <RequestElement request={request.data} />
            )) }

        </div>
   
        
    )
}
