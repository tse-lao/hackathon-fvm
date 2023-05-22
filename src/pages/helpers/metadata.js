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
                
                //check if the provided value is an array 
                let check = Array.isArray(result);
                console.log(check)
                const arrays = findArrays(result);
                
                const codeInfo = generateJsonCodeInfo(json)
                console.log(result)
                
                setShowMeta(arrays);
            } catch (error) {
                console.log(error)
            }
        };
    }

    function findArrays(metadata, path = []) {
        let arrays = [];
        
        if (Array.isArray(metadata)) {
            for (let i = 0; i < metadata.length; i++) {
                arrays.push(...findArrays(metadata[i], [...path, i]));
            }
        } else {
            for (let key in metadata) {
                if (metadata[key].type === 'array') {
                    arrays.push([...path, key].join('.'));
                }
    
                if (metadata[key].children) {
                    arrays.push(...findArrays(metadata[key].children, [...path, key]));
                }
            }
        }
    
        return arrays;
    }


    function count(){
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
