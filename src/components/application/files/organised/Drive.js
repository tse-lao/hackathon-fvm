import { useCollection, usePolybase } from "@polybase/react";
import { useEffect } from "react";
import LoadingIcon from "../../elements/loading/LoadingIcon";
import DriveItem from "./data/DriveItem";


export default function Drive({address}) {
  const polybase = usePolybase();
  const { data, error, loading } =
    useCollection(polybase.collection("File").where("owner", "==", address.toLowerCase()));
    
    useEffect(() => {
        console.log(address);
    }, [address])
    
  if(loading) return <LoadingIcon height={124}/>
  
  if(error) return <p>Error: {error.message}</p>
    
  return (

    <div>

        <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <div className="min-w-full divide-y divide-gray-300">
                        {data.data.length > 0 && !loading ?
                            data.data.map((item) =>
                                <DriveItem file={item.data} key={item.data.id} />
                            ) : (
                                <div className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {loading ? <LoadingSpinner /> : <span>No files found</span>}
                                </div>
                                
                            )}
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
  );
}
