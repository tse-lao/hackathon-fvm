import UploadModal from "@/components/UploadModal";
import { useCollection, usePolybase } from "@polybase/react";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../elements/LoadingSpinner";
import LoadingEmpty from "../../elements/loading/LoadingEmpty";
import DataNotFound from "../../elements/message/DataNotFound";
import DriveItem from "./data/DriveItem";

export default function Drive({ address }) {
    const [uploadFile, setUploadFile] = useState(false);
    const polybase = usePolybase();
    const { data, error, loading } =
        useCollection(polybase.collection("File").where("owner", "==", address.toLowerCase()).sort("addedAt", "desc"));

    useEffect(() => {
        console.log(address);
    }, [address])

    if (loading) return <LoadingEmpty />

    if (error) return <DataNotFound message={error.message}/>

    return (
        <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden ring-opacity-5 sm:rounded-lg">
                        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-2">
                            {data.data.length > 0 && !loading ?
                                data.data.map((item) =>
                                    <DriveItem file={item.data} key={item.data.id} />
                                ) : (
                                    <div className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {loading ? <LoadingSpinner /> : <DataNotFound message="No files found" />}
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
            {uploadFile && 
                <UploadModal onClose={() => setUploadFile(false)} open={uploadFile}  />
            }
            
            <button
            className="fixed bottom-12 right-12 bg-cf-500 text-white px-4 py-2 rounded"
            onClick={() => setUploadFile(true)}
          >
            Upload Files
          </button>
            <div>
                                    
            </div>
        </div>

    );
}
