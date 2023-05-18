
import Table from "@/components/application/data/Table";
import { getTableFromTableland } from "@/hooks/useTableland";
import { useEffect, useState } from "react";
import Layout from "../Layout";

export const computation = "computation_3141_15"
export const data_contribution = "data_contribution_80001_6096 "
export const DB_main = "file_main_80001_6097"
export const DB_attribute = "file_attribute_80001_6098"
const databases = [
    "file_main_80001_6135", 
    "computation_3141_15", 
    "data_contribution_80001_6134", 
    "file_attribute_80001_6136",
]

export default function TableLand() {
    const [loading, setLoading] = useState(true);

    const[selectedDB, setSelectedDB] = useState("file_main_80001_6097")
    const [data, setData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const result = await getTableFromTableland(selectedDB);

            console.log(result)
            setData(result)
        }
        getData();
    }, [selectedDB])

    const changeDB = (event) => {
        setSelectedDB(event.target.value)
    }


    return (
        <Layout>
            <div>
                <h1>
                    Tableland displaying.
                </h1>
                
                <select value={selectedDB} onChange={changeDB}>
                <option value="">Select...</option>
                {databases.map(item => <option value={item}>{item}</option>)}

              </select>
                
            </div>
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-auto border-b border-gray-200 sm:rounded-lg">
            {data.length > 0 ?
                <Table data={data} />
                : "No table selected"}
                </div>
                </div>
        </Layout>
    )
}

