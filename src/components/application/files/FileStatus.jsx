import { useDocument, usePolybase } from "@polybase/react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from 'uuid';
import LoadingSpinner from "../elements/LoadingSpinner";

export default function FileStatus({ metadata,cid, address }) {
    const polybase = usePolybase();
    const { data, loading } = useDocument(polybase.collection("File").where("cid", "==", cid).where("owner", "==", address));
    
    useEffect(() => {
    }, [address])


    // we want to check if the file contains a metadat
    const createRecord = async () => {
        if (cid == "") {
            toast.error("Please upload a file with a CID");
            return;
        }
        if (metadata === undefined || metadata.length < 1) {
            toast.error("Please upload a file with a structure");
            return;
        }
        const requestId = uuidv4();
        const requestTime = new Date().toISOString();
        //  constructor(id: string, cid: string, metadata:string, categories: string[], addedAt: string){

        await polybase.collection("File").create([
            requestId,
            cid,
            metadata,
            [],
            requestTime, 
            address
        ])

        toast.success("Succesfully stored metadata");
        
    }

    // if it does, we want to check if the file is uploaded to polybase
    if (loading) { return <span><LoadingSpinner /></span> }
    
    
    //no metadata found, create the workflow for it with only return one line. 
    if (data == null || data.data.length == 0) {
        if(metadata === undefined || metadata.length < 1){
            return <span className="text-grey-500">Create metadata</span>
        }
        
        
        return ( <span onClick={createRecord}
                    className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                >
                    Store metadata
                </span>
        )
    }
    
    return <span>{data.data[0].data.metadata}</span>;

}


