"use client"

import ProfileBalance from "@/components/application/profile/stats/ProfileBalance";
import GroupBountyProposal from "@/components/groups/details/GroupBountyProposal";
import GroupDetail from "@/components/groups/details/GroupDetail";
import GroupProposals from "@/components/groups/details/GroupProposals";
import GroupTransactions from "@/components/groups/details/GroupTransactions";
import GroupDataRequest from "@/components/groups/details/data/GroupDataRequest";
import Layout from "@/pages/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useBalance } from "wagmi";




export default function GroupDetailPage() {
    const router = useRouter()
    const [active, setActive] = useState('details')
    const { id } = router.query
    const { data: balance } = useBalance({ address: id })

    const [details, setDetails] = useState(
        {
            name: "something",
            description: "something ellse"
        }
    );
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const details = await fetch(`/api/tableland/multisig/details?multiSig='${id}'`)

            const resultDetails = await details.json();
            console.log(resultDetails);
            setDetails(resultDetails.result[0])

            let mem = []
            for (let i = 0; i < resultDetails.result[0].members.length; i++) {
                mem.push(resultDetails.result[0].members[i].ownerAddress)
            }


            setMembers(mem)
        }
        if (id == undefined) return;

        getData()
    }, [id])


    return (

        <Layout active="Groups">

            <div className='flex flex-col items-center justify-center gap-12 flex-wrap text-sm'>
                <div className="grid lg:grid-cols-3 sm:grid-cols-1 md:grid-cols-2 gap-4 items-center bg-white p-4 rounded-sm">
                    <div className="lg:col-span-2 md:col-span-1 sm:col-span-1">
                        <h1 className="text-md text-gray-800">{details.name}</h1>
                        <span className="text-gray-500">
                            {details.description}
                        </span>
                    </div>
                    <div className="col-span-1">
                        {balance && <ProfileBalance token="matic" balance={balance.formatted} />}
                    </div>

                </div>
                <div className='flex gap-6 flex-wrap'>
                    <span className={`hover:text-cf-500 px-4 py-2 cursor-pointer  ${active === 'details' && 'text-cf-500'}`} onClick={() => setActive('details')}>Details</span>
                    <span className={`hover:text-cf-500 px-4 py-2 cursor-pointer   ${active == 'proposals' && 'text-cf-500'}`} onClick={() => setActive('proposals')}>Proposals</span>
                    <span className={`hover:text-cf-500 px-4 py-2 cursor-pointer   ${active == 'transactions' && ' text-cf-500'}`} onClick={() => setActive('transactions')}>Transations</span>
                    <span className={`hover:text-cf-500 px-4 py-2 cursor-pointer   ${active == 'request' && 'text-cf-500'}`} onClick={() => setActive('request')}>Requests</span>
                </div>

                <div className=' w-[800px] p-8 rounded-md '>
                    {active == 'details' && <GroupDetail details={details} address={id} members={members} />}
                    {active == 'proposals' && <GroupProposals address={id} confirmationTable={details.confirmationTable} proposalTable={details.proposalTable} numberOfConfirmations={details.numberOfConfirmations} />}
                    {active == 'transactions' && <GroupTransactions address={id} confirmationTable={details.confirmationTable} proposalTable={details.proposalTable} numberOfConfirmations={details.numberOfConfirmations} />}
                    {active == 'bounty' && <GroupBountyProposal address={id} />}
                    {active == 'request' && <GroupDataRequest address={id} />}



                </div>
            </div>

        </Layout>
    );
}


