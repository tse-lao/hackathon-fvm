import { useEffect, useState } from "react"
import DataNotFound from "../application/elements/message/DataNotFound"

export default function AllComputations({ dbCID, input }) {
    const [computations, setComputations] = useState([])

    useEffect(() => {
        const fetchData = async () => {

            const result = await fetch(`/api/tableland/computations/dataset?cid=${dbCID}`)

            const data = await result.json()
            console.log(data);
            if (data.result.message == "Row not found") { return; }
            setComputations(data.result)
        }

        fetchData()
    }, [input, dbCID])

    if (computations.length == 0) {
        return (
            <DataNotFound message="No computations found" />
        )
    }

    return (
        computations.length > 0 &&
        computations.map((computation) => (
            <div>
                {JSON.stringify(computations)}
            </div>
        ))
    );

}
