import { DB_attribute, DB_main } from "@/constants";
import { useEffect, useState } from "react";
import LoadingIcon from "../elements/loading/LoadingIcon";
import Filters from "../overlay/Filters";
import RequestElement from "./RequestElement";
export default function ListRequest() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({
        open: false,
        categories: []
    });
    useEffect(() => {

        const getData = async () => {
            setLoading(true)

            let query = `WHERE ${DB_main}.label='label'`;

            if (filters.categories.length > 0) {
                filters.categories.forEach((category, index) => {
                    if (index == 0) {
                        query += `AND ${DB_attribute}.trait_type='category' AND (${DB_attribute}.value='${category}'`;
                    } else {
                        query += `OR ${DB_attribute}.value='${category}'`;
                    }

                });
                query += ')';
            }

            const marketplace = await fetch(`/api/tableland/token/all?where=${query}`);
            const data = await marketplace.json();
            setData(data.result)

            setLoading(false)
        }

        getData();
    }, [filters])

    const selectChange = (changedFilters) => {
        setFilters(changedFilters)

    }




    if (loading) return <LoadingIcon />
    return (
        <div className="flex flex-col">
            <Filters name="Data Requests" selectChange={selectChange} currentFilters={filters} />


            <main className="flex-1">
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-col-3 gap-6">
                    {data.length > 0 ? data.map((request, index) => (
                        <RequestElement index={index} request={request} key={index} />
                    )) : (<p>No data found!</p>)}
                </div>
            </main>
        </div>


    )
}
