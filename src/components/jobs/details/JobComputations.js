import LoadingEmpty from "@/components/application/elements/loading/LoadingEmpty"
import DataNotFound from "@/components/application/elements/message/DataNotFound"
import { useEffect, useState } from "react"
import JobComputationItem from "./JobComputationItem"

const computations = [
    {
        id: 1, 
        job_id: 'hsdfusi-sdfs23fs-sdfsd9-dsdf9', 
        status: 'some status', 
        requestor: "0xq3902342354",
        inputs: "testi, testig"
    },
    {
        id: 1, 
        job_id: 'hsdfusi-sdfs23fs-sdfsd9-dsdf9', 
        status: 'some status', 
        requestor: "0xq3902342354",
        inputs: "testi, testig"
    }, 
    {
        id: 1, 
        job_id: 'hsdfusi-sdfs23fs-sdfsd9-dsdf9', 
        status: 'some status', 
        requestor: "0xq3902342354",
        inputs: "testi, testig"
    }, 
    {
        id: 1, 
        job_id: 'hsdfusi-sdfs23fs-sdfsd9-dsdf9', 
        status: 'some status', 
        requestor: "0xq3902342354",
        inputs: "testi, testig"
    }
]
export default function JobComputations({jobId}) {
    const [data, setData]= useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        //fetch here tableland for info 
        //TODO: call function here when its implements and check if jobID is indeed name JobId
        window.alert("dummy data still.")
    }, [jobId])
    
    const fetchDatasets = async() => {
        setLoading(true)
        let query = `WHERE jobId = '${jobId}'`;
        const marketplace = await fetch(`/api/tableland/computations/all?where=${query}`);
        const data = await marketplace.json();
        setData(data.result);
        setLoading(false);
    }
    
if(loading) return <LoadingEmpty />
    
  return (
        computations.length > 0 ? computations.map((item, key) => (
            <JobComputationItem data={item} />
        )): 
        <DataNotFound message="No computation performed" />
  )
}
