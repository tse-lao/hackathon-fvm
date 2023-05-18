import { getNfts } from '@/hooks/useBlockchain';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../elements/LoadingSpinner';

export default function ProfileDataSets({ creator }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const getData = async () => {
      const response = await getNfts(creator);
      setData(response)
      setLoading(false)

    }

    if (creator) { getData() }
  }, [creator])

  if(loading) return <LoadingSpinner />;
  return (
    <div>
      <div className="flex items-center gap-8">
        {data.length > 0 && data.map((item, index) => (
          <Link key={index} href={`/market/${item.tokenId}`}>
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <div className="flex flex-col gap-8 items-center">
              <span>{item.tokenType} | {item.tokenId} / {item.contract.totalSupply}</span>
              <span className='text-cf-600 text-sm'>{item.contract.address} </span>
              <div className="ml-4">
                <time datetime="">{item.timeLastUpdated}</time>
              </div>
            </div>
          </div>
        </Link>
        ))}
      </div>
    </div>
  )
}
