import { MerkleHelper } from '@/constants/tableland';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ActionButton } from '../elements/buttons/ActionButton';
import LoadingEmpty from '../elements/loading/LoadingEmpty';
import DataNotFound from '../elements/message/DataNotFound';
import CreateRepository from '../files/organised/repo/CreateRepository';


export default function Repository() {
    const [openModal, setOpenModal] = useState(false);
    const {address} = useAccount();
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const fetchData = async (id) => {
        const result = await fetch(`/api/tableland/merkle/all?where= WHERE ${MerkleHelper}.address='${address.toLowerCase()}'`);
        const data = await result.json();
        console.log(data.result);
        setRepos(data.result);
        setLoading(false);
    
      }
        fetchData();
  
    }, [])
    
  if(loading) return <LoadingEmpty />
    
  return (
    <div className='flex flex-col w-full'>
        {openModal && <CreateRepository setOpenModal={setOpenModal} /> }
        <div className='content-end mb-10 flex justify-between items-center'>
          <h1 className='text-lg font-bold text-gray-700'>Private Groups</h1>
          <span>Share your data, files or photos only with your registered users. </span>
          
          <div className="w-[250px]">
            <ActionButton  onClick={() => setOpenModal(true)} text="Create Group" />
          </div>
        </div>
        <div>
            
            <div className='grid grid-cols-3 gap-4 justify-self-auto justify-items-stretch'>
            {repos.length > 0 ? repos.map((repo, index) => (
              <Link key={index} href={`/files/repo/${repo.tokenID}`}>
              <div key={repo.tokenID} className='col-span-1 bg-white p-4 flex flex-col p-6 gap-4 text-gray-600 rounded-md hover:bg-cf-200 justify-items-stretch'>
                  <span className='text-bold text-lg text-gray-900'>{repo.tokenID}  {repo.dbName}  </span>
                  <span className='text-gray-600 text-sm'>{repo.description}</span>
                </div>
                </Link>
            ))
            : <DataNotFound  message="No Repos Found" />

          }
          </div>            
        </div>
    </div>
  )
}
