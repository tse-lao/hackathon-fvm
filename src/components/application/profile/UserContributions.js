
import { getAllContributionData } from '@/hooks/useTableland';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../elements/LoadingSpinner';

export default function UserContributions({creator}){
    const [loading, setLoading] = useState(true);
    const [contributions, setContributions] = useState([])
    
    useEffect(() => {
        const getData = async() => {
            const result = await getAllContributionData(creator);
            console.log(result)
            setContributions(result)
            setLoading(false)
        }
    
        if(creator){ getData()}
        

    }, [creator])
    
    if(loading) return <LoadingSpinner />
    return (
        <div className="flex flex-row bg-white flex-wrap">
            {contributions.map((item) => (
               <div className="flex p-8 flex flex-col">
                    <span>{item.dataCID}</span>
                    <span>{item.dbName} - {item.tokenID }</span>
                    <span>{item.rows}</span>
               </div>
            )
        )}
        </div>
    )
}