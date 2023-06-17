import DataNotFound from "@/components/application/elements/message/DataNotFound"
import { useEffect, useState } from "react"
import ItemJobDataset from "./ItemJobDataset"

const datasets = [
    {
        id: 1, 
        name: "DUMMY DATA", 
        rows: 10.000, 
        metadata: "Qcmsdfsdlfsldfksdlfmslfkm", 
        owner: "0x34293423424", 
        price: 0.04
    }, 
    {
        id: 1, 
        name: "dataname", 
        rows: 10.000, 
        metadata: "Qcmsdfsdlfsldfksdlfmslfkm", 
        owner: "0x34293423424", 
        price: 0.04
    }, 
    {
        id: 1, 
        name: "dataname", 
        rows: 10000, 
        metadata: "Qcmsdfsdlfsldfksdlfmslfkm", 
        owner: "0x34293423424", 
        price: 0.04
    }, 
    {
        id: 1, 
        name: "dataname", 
        rows: 10000000, 
        metadata: "Qcmsdfsdlfsldfksdlfmslfkm", 
        owner: "0x34293423424", 
        price: 0.04
    }
]

export default function JobDatasets({jobId, metadata}) {
    const [data, setData] = useState(datasets)
    useEffect(() => {
        //window.alert("not yet implemented")
    }, [metadata, jobId])
    
    const fetchDatasets = async() => {
        let query = `WHERE dataFormatCid = ${metadata}`
        
        const marketplace = await fetch(`/api/tableland/token/all?where=${query}`);
        const data = await marketplace.json();
        setDatasets(data.result);
        setLoading(false);
    }
    
  return (
    <div>
        {data.length > 0 ? data.map((item, key) => (
            <ItemJobDataset data={item} key={key}/>

        )): <DataNotFound message="no datasets matching" />}
    </div>
  )
}
