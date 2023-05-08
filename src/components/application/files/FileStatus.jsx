import { useDocument, usePolybase } from "@polybase/react";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import CheckboxSelect from "../elements/Checkbox";

export default function FileStatus({ record }) {
    const polybase = usePolybase();
    const { data, error, loading } = useDocument(polybase.collection("File").where("cid", "==", record.cid));
    
    const [selectedCategories, setSelectedCategories] = useState([]);

    const categories = [
        'Mobility',
        'Ad Preferences',
        'Health',
        'Interactions',
        'Interests',
    ];

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
            record.cid,
            record.metadata,
            selectedCategories,
            requestTime
        ])

        console.log(collection)




    }

    // if it does, we want to check if the file is uploaded to polybase
    if (error) { return (<div>Error: {error.message}</div>) }
    if (loading) { return (<div>Loading...</div>) }
    if (data.data.length == 0) {
        return (
            <div>
            
                <div>
                    <span>CID</span>
                    <span>{record.cid}</span>
                </div>
                <div>
                <span>metadata</span>
                <span>{record.metadata}</span>
            </div>
                <CheckboxSelect
                    options={categories}
                    selectedValues={selectedCategories}
                    onChange={handleCategoryChange}
                />
                <button onClick={createRecord}>
                    Create Record
                </button>

            </div>
        )
    }

    return (
        <div>
            {JSON.stringify(data)}
        </div>
    )
}


