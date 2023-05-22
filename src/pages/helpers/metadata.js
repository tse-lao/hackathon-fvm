import { ActionButton } from "@/components/application/elements/buttons/ActionButton";
import { analyzeJSONStructure } from "@/lib/dataHelper";
import { useState } from "react";
import Layout from "../Layout";
// Your JSON data
let jsonData = `{
    "array1": [
      {
        "lat": 35.6895,
        "lon": 139.6917,
        "timestamp": 1620597600
      },
      {
        "lat": 37.5665,
        "lon": 126.978,
        "timestamp": 1620597660
      }
    ],
    "nested": {
      "nestedArray1": [
        {
          "name": "John",
          "age": 30,
          "city": "New York"
        },
        {
          "name": "Jane",
          "age": 40,
          "city": "Chicago"
        }
      ]
    }
  }`;


export default function Metadata() {

    const [showMeta, setShowMeta] = useState({});

    const uploadFile = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = async function (event) {
            try {
                const json = JSON.parse(event.target.result);
                console.log(json)

                const result = await analyzeJSONStructure(json);
                console.log(result)

                const arrays = await generateMetadata(json);
                console.log(arrays)

                setShowMeta(arrays);
            } catch (error) {
                console.log(error)
            }
        };
    }


    // Recursive function to identify all arrays within parsed JSON data
    function identifyArrays(parsedData, name = '') {
        let arrayCounts = {};
        for (let key in parsedData) {
            if (Array.isArray(parsedData[key])) {
                arrayCounts[name + key] = parsedData[key].length;
            }
            if (typeof parsedData[key] === 'object' && parsedData[key] !== null) {
                let nestedCounts = identifyArrays(parsedData[key], name + key + '.');
                arrayCounts = { ...arrayCounts, ...nestedCounts };
            }
        }
        return arrayCounts;
    }


        let parsedData = JSON.parse(jsonData);


    function generateMetadata(parsedData, name = '') {
        let metadata = {};
        for (let key in parsedData) {
            if (Array.isArray(parsedData[key]) && parsedData[key].length > 0) {
                let structure = {};
                for (let subKey in parsedData[key][0]) {
                    structure[subKey] = typeof parsedData[key][0][subKey];
                }
                metadata[name + key] = structure;
            }
            if (typeof parsedData[key] === 'object' && parsedData[key] !== null) {
                let nestedMetadata = generateMetadata(parsedData[key], name + key + '.');
                metadata = { ...metadata, ...nestedMetadata };
            }
        }
        
        setShowMeta(metadata);
        return metadata;
    }

    return (
        <Layout>
            <div className="flex flex-col">
                <h1>Analysing the metadata here</h1>
                <input type="file" onChange={uploadFile} />
                <ActionButton onClick={() => generateMetadata(parsedData)} text="analyze" />

                <pre>
                    {JSON.stringify(showMeta, null, 2)}
                </pre>
            </div>

        </Layout>
    )
}
