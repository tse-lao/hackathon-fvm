import { readFromCID } from "@/hooks/useNftStorage";
import { useEffect, useState } from "react";
import LoadingSpinner from "../application/elements/LoadingSpinner";

export default function DataFormatPreview({cid}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const readData = async () => {
      setLoading(true);
      const result = await readFromCID(cid)
      setData(result);
      setLoading(false);
    }
    if(!cid) return; 
    readData();
  }, [cid])
  
  
  if(loading) { return <LoadingSpinner /> }
  return (
       <pre className="overflow-scroll max-h-96 p-6 text-xs">
        {JSON.stringify(data, null, 1)}
      </pre>
  )
}