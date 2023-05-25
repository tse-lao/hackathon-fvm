import { getNfts } from '@/hooks/useBlockchain';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Toggle from '../Toggle';
import LoadingEmpty from '../elements/loading/LoadingEmpty';

export default function ProfileDataSets({ creator }) {
  const [data, setData] = useState([])
  const [owned, setOwned] = useState([])
  const [loading, setLoading] = useState(true)
  const [created, setCreated] = useState(false)
  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      const response = await getNfts(creator);
      setData(response)
      setLoading(false)
    }
    const getCreated = async () => {
      setLoading(true)
      const response = await fetch(`/api/tableland/token/owned?creator=${creator.toLowerCase()}`);
      const data = await response.json();
      console.log(data)
      setOwned(data.result)
      setLoading(false)
    }

    if (creator) {
      if (created && owned.length < 1) { getCreated() }
      if (!created && data.length < 1) { getData() }
    }
  }, [creator, created])

  if (loading) return <LoadingEmpty />;
  return (
    <div className="w-full flex flex-col gap-8">
    <div className='flex justify-end'>
      <Toggle changeStatus={() => setCreated(!created)} text="Select owned" status={created} />
    </div>

      <div className="grid md:grid-cols-2 items-center gap-4">

        {!created && (data.length > 0 ? data.map((item, index) => (
          <Link key={index} href={`/market/${item.tokenId}`}>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <div className="flex flex-col gap-4 items-center">
                <span className='text-cf-600 text-sm'>{item.contract.address} </span>
                <span>{item.tokenType} | {item.tokenId} / {item.contract.totalSupply}</span>

                <div className="ml-4">
                  <time className='text-gray-500 text-sm'>{item.timeLastUpdated}</time>
                </div>
              </div>
            </div>
          </Link>
        )) :
        <div className=" col-span-2 overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <div className="flex flex-col gap-4 items-center ">No data !</div></div>
        )}

        {created && (owned.length > 0 ? owned.map((item, index) => 
          <Link key={index} href={item.piece_cid == 'piece_cid' ? `/market/${item.tokenID}`: `/request/${item.tokenID}` }>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <div className="flex flex-col gap-4 items-center">
                <h2 className='text-lg text-gray-600'>{item.dbName}</h2>
                <span className='text-cf-600 text-sm'>{item.dbCID} </span>
                <span>Token {item.tokenID}</span>
              </div>
            </div>
          </Link>
        ) :  
        <div className=" col-span-2 overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <div className="flex flex-col gap-4 items-center ">No data !</div></div>
        )}
      </div>
    </div>
  )
}
