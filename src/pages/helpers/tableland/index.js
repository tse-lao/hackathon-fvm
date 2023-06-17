
import Table from "@/components/application/data/Table";
import {
    BountiesTable,
    ClaimDealsTable,
    DB_attribute,
    DB_main,
    DealClientDeals,
    DealRequests,
    MerkleHelper,
    MultisigOwnersTable,
    MultisigTable,
    computation,
    data_contribution,
    job,
    job_bounty,
    openAttribute,
    openContribution,
    openMain,
} from '@/constants/tableland';
import { getTableFromTableland } from "@/hooks/useTableland";
import Layout from "@/pages/Layout";
import { useEffect, useState } from "react";

// Define an array to store the imported values
const exportsList = [];


// Add the imported values to the array
exportsList.push(computation);
exportsList.push(data_contribution);
exportsList.push(DB_main);
exportsList.push(DB_attribute);
exportsList.push(DealRequests);
exportsList.push(DealClientDeals);
exportsList.push(MerkleHelper);
exportsList.push(MultisigTable);
exportsList.push(MultisigOwnersTable);
exportsList.push(openMain);
exportsList.push(openAttribute);
exportsList.push(openContribution);
exportsList.push(job);
exportsList.push(job_bounty);
exportsList.push(ClaimDealsTable);
exportsList.push(BountiesTable);


export default function TableLand() {
    const [loading, setLoading] = useState(true);

    const [selectedDB, setSelectedDB] = useState("file_main_80001_6097")
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
                    {exportsList.map((item, key) => <option key={key} value={item}>{item}</option>)}

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

