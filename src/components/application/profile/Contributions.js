import { getAllContributionData } from "@/hooks/useTableland";
import { useEffect, useState } from "react";
import LoadingSpinner from "../elements/LoadingSpinner";
import ContributionItem from "./ContributionItem";



export default function Contributions({creator}) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {

        const getData = async () => {
            const response = await getAllContributionData(creator);
            console.log(response)
            setData(response)
            setLoading(false)
        }
        getData()

    }, [creator])
    
    if(loading) return (<LoadingSpinner msg="Loading Contributions" />);
  return (
    <div className="flex flex-row flex-wrap gap-4 mt-8">
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
