import { useTableland } from '@/hooks/useTableland';
import { useEffect, useState } from 'react';

export default function Contributions({ tokenID }) {
    const [submissions, setSubmissions] = useState([])
    const { fetchDataSubmission } = useTableland();
    useEffect(() => {
        const fetchSubmission = async () => {
            const response = await fetchDataSubmission(tokenID);
            
            if(response != "Row not found"){
                 
                console.log(response);
                setSubmissions(response)
            }
           
        }

        if (tokenID) { fetchSubmission(); }
    }, [tokenID])

    return (
        <div className="max-w-lg mx-auto">
        <div className="divide-y divide-gray-200">
            {submissions.length > 0 ? submissions.map((submission, index) => (
                <a key={index} href={submission.metadataCID} className="block py-4 hover:bg-gray-100 transition-colors duration-150 cursor-pointer">
                    <div className="text-gray-600 text-sm font-medium mb-1 text-indigo-500 overflow-hidden overflow-ellipsis whitespace-nowrap">{`${submission.dataCID}`}</div>
                    <div className="grid grid-cols-2 gap-2 my-2 text-xs">
                        <div className="font-semibold text-gray-500">Rows:</div>
                        <div className="text-gray-900">{submission.rows}</div>
                        <div className="font-semibold text-gray-500">Token:</div>
                        <div className="text-gray-900">{submission.tokenID}</div>
                        <div className="font-semibold text-gray-500">Submitter:</div>
                        <div className="text-gray-900">{submission.creator}</div>
                    </div>
                </a>
            )) : (
                <div className="text-center py-8">
                <p className="text-gray-500 text-xl font-medium">No contributions found</p>
                <p className="text-gray-400 text-md">Check back later for new submissions.</p>
            </div>
            )}
        </div>
    </div>
    
    )
}
