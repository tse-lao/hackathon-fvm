import { useEffect, useState } from "react";
import LoadingEmpty from "../elements/loading/LoadingEmpty";
import ContributionItem from "./ContributionItem";



export default function Contributions({creator}) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {

        const getData = async () => {

            const result = await fetch(`/api/tableland/contributions?creator=${creator.toLowerCase()}`)
            const data = await result.json()

            setData(data.result)
            setLoading(false)
        }
        if(creator != undefined)  getData();

       

    }, [creator])
    
    if(loading) return (<LoadingEmpty />);
  return (
    <div className="grid md:grid-cols-2 flex-wrap gap-4 mt-8">
        {data.length > 0 ? data.map((item, index) => (
            <ContributionItem key={index} contribution={item} />
        )) : (
        <div className="text-center py-8 px-12 bg-white">
            <p className="text-gray-500 text-xl font-medium">No contributions found</p>
            <p className="text-gray-400 text-md">Check back later for new submissions.</p>
        </div>
        )}
    </div>
  )
}
