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
        <div>
            <div className="rounded-lg h-96 overflow-scroll">
                {submissions.length > 0 ?
                    submissions.map((submission, index) => (
                        <div key={index} className="flex flex-row bg-white shadow-sm rounded-lg p-2 mt-2 hover:bg-cf-100">
                            <div className="flex-grow">
                                <h2 className="text-gray-900 text-lg title-font font-medium mb-2">{`Dataset ${submission.dataCID}`} </h2>
                                <p className="leading-relaxed text-base">Rows: {submission.rows}</p>
                                <p className="leading-relaxed text-base">Token: {submission.tokenID}</p>
                                <p className="leading-relaxed text-base">Submitter: {submission.creator}</p>
                                <a href={submission.metadataCID} className="mt-3 text-indigo-500 inline-flex items-center">View Dataset
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    )) : (
                        <p>No contributions found</p>
                    )
                }
            </div>
        </div>



    )
}
