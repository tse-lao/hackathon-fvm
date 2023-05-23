import { MerkleHelper } from '@/constants/tableland';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ActionButton } from '../elements/buttons/ActionButton';
import DataNotFound from '../elements/message/DataNotFound';
import CreateRepository from '../files/organised/repo/CreateRepository';


export default function Repository() {
    const [openModal, setOpenModal] = useState(false);
    const {address} = useAccount();
    const [repos, setRepos] = useState([]);
    
    useEffect(() => {
      const fetchData = async (id) => {
        const result = await fetch(`/api/tableland/merkle/all?where= WHERE ${MerkleHelper}.address='${address }'`);
        const data = await result.json();
        console.log(data.result);
        setRepos(data.result);
    
      }
        fetchData();
  
    }, [])
    
  return (
    <div className='flex flex-col w-full'>
        {openModal && <CreateRepository setOpenModal={setOpenModal} /> }
        <div className='content-end mb-10 flex justify-between items-center'>
          <h1 className='text-lg font-bold text-gray-700'>Private Repositories</h1>
          
          <div className="w-[250px]">
            <ActionButton  onClick={() => setOpenModal(true)} text="Create Repository" />
          </div>
        </div>
        <div>
            
            <div className='grid grid-cols-3 gap-4'>
            {repos.length > 0 ? repos.map((repo, index) => (
              <Link key={index} href={`/files/repo/${repo.tokenID}`}>
              <div key={repo.tokenID} className='col-span-1 bg-white p-4 flex flex-col gap-4 text-gray-600 rounded-md hover:bg-cf-200 '>
                  <span className='text-bold text-lg text-gray-900'>{repo.tokenID}  {repo.dbName}  </span>
                  <span>{repo.description}</span>
                  <span>{repo.blockTimestamp}</span>
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
