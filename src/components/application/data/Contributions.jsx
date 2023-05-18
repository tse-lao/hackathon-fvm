import DataContributor from '@/components/marketplace/detail/DataContributor';
import { fetchDataSubmission } from '@/hooks/useTableland';
import { useEffect, useState } from 'react';


export default function Contributions({ tokenID }) {
    const [submissions, setSubmissions] = useState([])

    useEffect(() => {
        const fetchSubmission = async () => {
            const response = await fetchDataSubmission(tokenID);
            
            if(response != "Row not found"){

                setSubmissions(response)
            }
           
        }

        if (tokenID) { fetchSubmission(); }
    }, [tokenID])

    return (
        <div className="max-w-lg mx-auto">

            {submissions.length > 0 ? submissions.map((submission, index) => (
               
                    <DataContributor key={index} contribution={submission} />
               
            )) : (
            <div className="text-center py-8">
                <p className="text-gray-500 text-xl font-medium">No contributions found</p>
                <p className="text-gray-400 text-md">Check back later for new submissions.</p>
            </div>
            )}

    </div>
    
    )
}
