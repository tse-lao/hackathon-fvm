import { useDocument, usePolybase } from "@polybase/react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function FileStatus({ metadata,cid, address }) {
    const polybase = usePolybase();
    const { data, loading } = useDocument(polybase.collection("File").where("cid", "==", cid).where("owner", "==", address));

    const [selectedCategories, setSelectedCategories] = useState([]);

    const categories = [
        'Mobility',
        'Ad Preferences',
        'Health',
        'Interactions',
        'Interests',
    ];
    
    useEffect(() => {
    }, [address])

    const handleCategoryChange = (newSelectedCategories) => {
        setSelectedCategories(newSelectedCategories);
    };


    // we want to check if the file contains a metadat
    const createRecord = async () => {

        console.log(record)

        if (record.cid == "") {
            alert("Please upload a file with a CID");
            return;
        }
        if (record.metadata == "") {
            alert("Please upload a file with a structure");
            return;
        }


        const requestId = uuidv4();

        const requestTime = new Date().toISOString();
        //  constructor(id: string, cid: string, metadata:string, categories: string[], addedAt: string){

        const collection = await polybase.collection("File").create([
            requestId,
            cid,
            metadata,
            selectedCategories,
            requestTime, 
            address
        ])

        console.log(collection)




    }

    // if it does, we want to check if the file is uploaded to polybase
    if (loading) { return (<div>Loading...</div>) }
    if (data == null || data.data.length == 0) {
        return (
            <div>
                <div>
                    <span>metadata</span>
                    <span>{metadata}</span>
                </div>
                {metadata == "" ? <button onClick={createRecord}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-500 hover:bg-cf-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cf-indigo-500"
                >
                    Create Metadata CID
                </button> : <button onClick={createRecord}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cf-500 hover:bg-cf-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cf-indigo-500"
                >
                    Create Record
                </button>
                }
            </div>
        )
    }

    return (
        console.log(data),
        <div>
            <dl className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                <div className="flex justify-between py-3 text-sm font-medium">
                    <dt className="text-gray-500">Added At</dt>
                    <dd className="text-gray-900">{data.data[0].data.addedAt}</dd>
                </div>
                <div className="flex justify-between py-3 text-sm font-medium">
                    <dt className="text-gray-500">MetaData cid</dt>
                    <dd className="text-gray-900">{data.data[0].data.metadata}</dd>
                </div>

            </dl>
        </div>
    )
}


