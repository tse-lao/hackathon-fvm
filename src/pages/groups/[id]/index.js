"use client"

import ProfileBalance from "@/components/application/profile/stats/ProfileBalance";
import GroupBountyProposal from "@/components/groups/details/GroupBountyProposal";
import GroupDetail from "@/components/groups/details/GroupDetail";
import GroupProposals from "@/components/groups/details/GroupProposals";
import GroupTransactions from "@/components/groups/details/GroupTransactions";
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
        setDetails({
            name: "some name",
            description: "some description"
        })


        if (id == undefined) return;

        getData()
    }, [id])


    return (

        <Layout active="Groups">

            <div className='flex flex-col items-center justify-center gap-12 flex-wrap text-sm'>
                <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="col-span-2">
                        <h1 className="text-md text-gray-800">{details.name}</h1>
                        <span className="text-gray-500">
                            {details.description}
                        </span>
                    </div>
                    <div className="col-span-1">
                        {balance && <ProfileBalance token="matic" balance={balance.formatted} />}
                    </div>

                </div>
                <div className='flex gap-12 flex-wrap'>
                    <span className={`hover:bg-cf-500 px-4 py-2 cursor-pointer hover:text-white rounded-full ${active === 'details' && 'bg-cf-500 text-white'}`} onClick={() => setActive('details')}>Details</span>
                    <span className={`hover:bg-cf-500 px-4 py-2 cursor-pointer hover:text-white rounded-full ${active == 'proposals' && 'bg-cf-500 text-white'}`} onClick={() => setActive('proposals')}>Proposals</span>
                    <span className={`hover:bg-cf-500 px-4 py-2 cursor-pointer hover:text-white rounded-full ${active == 'transactions' && 'bg-cf-500 text-white'}`} onClick={() => setActive('transactions')}>Transations</span>
                    <span className={`hover:bg-cf-500 px-4 py-2 cursor-pointer hover:text-white rounded-full ${active == 'bounty' && 'bg-cf-500 text-white'}`} onClick={() => setActive('bounty')}>Bounty</span>
                </div>

                <div className=' w-[800px] p-8 rounded-md '>
                    {active == 'details' && <GroupDetail details={details} address={id} members={members} />}
                    {active == 'proposals' && <GroupProposals address={id} confirmationTable={details.confirmationTable} proposalTable={details.proposalTable} numberOfConfirmations={details.numberOfConfirmations} />}
                    {active == 'transactions' && <GroupTransactions address={id} />}
                    {active == 'bounty' && <GroupBountyProposal address={id} />}



                </div>
            </div>

        </Layout>
    );
}


