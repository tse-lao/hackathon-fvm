import { useCollection, usePolybase } from "@polybase/react";

export default function ListRequest() {
    const polybase = usePolybase();
    const { data, error, loading } =
      useCollection(polybase.collection("DataRequest"));

    
    if(loading) return <p>Loading...</p>
    
    if(error) return <p>Error: {error.message}</p>
    
    return JSON.stringify(data, null, 2)
}
