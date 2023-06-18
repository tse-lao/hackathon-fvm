"use client"

import ProfileBalance from "@/components/application/profile/stats/ProfileBalance";
import GroupBountyProposal from "@/components/groups/details/GroupBountyProposal";
import GroupDeals from "@/components/groups/details/GroupDeals";
import GroupDetail from "@/components/groups/details/GroupDetail";
import GroupProposals from "@/components/groups/details/GroupProposals";
import GroupTransactions from "@/components/groups/details/GroupTransactions";
import GroupDataRequest from "@/components/groups/details/data/GroupDataRequest";
import { useContract } from "@/hooks/useContract";
import Layout from "@/pages/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useBalance, useSwitchNetwork } from "wagmi";




export default function GroupDetailPage() {
    const router = useRouter()
    const [active, setActive] = useState('details')
    const { createDataDAO, getMarketBalance } = useContract();
    const { id } = router.query
    const { data: balance } = useBalance({ address: id })
    const [loading, setLoading] = useState(true);
    const { switchNetwork } = useSwitchNetwork();
    const [dataDao, setDataDao] = useState({
        address: "0x00",
        dataCap: 0,
        marketBalance: 0
    });
    const [details, setDetails] = useState(
        {
            name: "something",
            description: "something ellse",
        }
    );
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const details = await fetch(`/api/tableland/multisig/details?multiSig='${id}'`)
            const getDAO = await fetch(`/api/tableland/multisig/dao?multiSig=${id}`)
            const dao = await getDAO.json();
            console.log(dao.result[0]);

            const resultDetails = await details.json();
            console.log(resultDetails);


            setDetails(resultDetails.result[0])

            if (resultDetails.length > 0) {

                const marketBalance = await getMarketBalance(resultDetails.result[0]);
                const dataCap = await getDataCap(resultDetails.result[0]);
                let daoDetails = {
                    address: resultDetails.result[0],
                    dataCap: dataCap,
                    marketBalance: marketBalance

                }
                
                setDataDao(daoDetails)
            }

            let mem = []
            for (let i = 0; i < resultDetails.result[0].members.length; i++) {
                mem.push(resultDetails.result[0].members[i].ownerAddress)
            }
            
            



            setMembers(mem)
            setLoading(false)
        }
        if (id == undefined) return;

        getData()
    }, [id]);

    const createStorage = async () => {

        console.log(members);
        console.log(id);
        
        await switchNetwork({
            chainId: '314159',
        })

        toast.promise(createDataDAO(members, id), {
            pending: 'Creating Data DAO',
            success: 'Data DAO Created',
            error: 'Error Creating Data DAO',

        })
        
        await switchNetwork({
            chainId: 80001, 
            })
    }


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

                        {dataDao.address != "0x00" ? (
                            <div>
                                <span> {details.dataDao.address}</span>
                                <span> {details.dataDao.marketBalance}</span>
                                <span> {details.dataDao.dataCap}</span>
                            </div>
                        ) : (
                            <div>
                            </div>
                        )}

                    </div>



                </div>
                <div className='flex gap-6 flex-wrap'>
                    <span className={`hover:text-cf-500 px-4 py-2 cursor-pointer  ${active === 'details' && 'text-cf-500'}`} onClick={() => setActive('details')}>Details</span>
                    <span className={`hover:text-cf-500 px-4 py-2 cursor-pointer  ${active == 'proposals' && 'text-cf-500'}`} onClick={() => setActive('proposals')}>Proposals</span>
                    <span className={`hover:text-cf-500 px-4 py-2 cursor-pointer  ${active == 'transactions' && ' text-cf-500'}`} onClick={() => setActive('transactions')}>Transations</span>
                    <span className={`hover:text-cf-500 px-4 py-2 cursor-pointer  ${active == 'data-request' && 'text-cf-500'}`} onClick={() => setActive('data-request')}>Data Request</span>
                    <span className={`hover:text-cf-500 px-4 py-2 cursor-pointer  ${active == 'job-request' && 'text-cf-500'}`} onClick={() => setActive('job-request')}>Job Request</span>
                    <span className={`hover:text-cf-500 px-4 py-2 cursor-pointer  ${active == 'group-files' && 'text-cf-500'}`} onClick={() => setActive('group-files')}>Files</span>
                    <span className={`hover:text-cf-500 px-4 py-2 cursor-pointer  ${active == 'group-deals' && 'text-cf-500'}`} onClick={() => setActive('group-deals')}>Deals</span>
                </div>

                <div className=' w-[800px] p-8 rounded-md '>
                    {active == 'details' && <GroupDetail details={details} address={id} members={members} />}
                    {active == 'proposals' && <GroupProposals address={id} confirmationTable={details.confirmationTable} proposalTable={details.proposalTable} numberOfConfirmations={details.numberOfConfirmations} />}
                    {active == 'transactions' && <GroupTransactions address={id} confirmationTable={details.confirmationTable} proposalTable={details.proposalTable} numberOfConfirmations={details.numberOfConfirmations} />}
                    {active == 'job-request' && <GroupBountyProposal address={id} />}
                    {active == 'data-request' && <GroupDataRequest address={id} />}
                    {active == 'group-files' && <GroupFiles address={id} />}
                    {active == 'group-deals' && <GroupDeals address={id} />}
                </div>
            </div>

        </Layout>
    );
}


