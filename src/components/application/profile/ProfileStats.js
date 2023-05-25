"use client"
import { formatBytes } from '@/lib/helpers';
import lighthouse from '@lighthouse-web3/sdk';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';

export default function ProfileStats({ address }) {
  const {address: ownAddress} = useAccount()
  const [stats, setStats] = useState([
    { name: 'Data Used', current: 'loading...', total: 'loading...' },
    { name: 'Contributions', current: 'loading...' },
    { name: 'Balance', current: 'loading...', total: 'loading...' },
  ])
  const {data: userBalance} = useBalance({address})
  
  useEffect(() => {
    const newStats = []
    const getBalance = async () => {
      console.log(address)
      const balance = await lighthouse.getBalance(address);
      newStats.push(
        {
          name: 'Data Used',
          current: formatBytes(balance.data.dataUsed),
          total: formatBytes(balance.data.dataLimit)
        })

      const res = await fetch(`/api/tableland/contributions/count?creator=${address.toLowerCase()}`);
      const data = await res.json();
      console.log(data.result)

      newStats.push(
        {
          name: 'Contributions',
          current: data,

        });

console.log(userBalance)
        if(userBalance){
          newStats.push(
        {
          name: 'Balance',
          current: userBalance.formatted,
        })
        }
      
      //get current ETH balance
      setStats(newStats)
    }
    
    if(address){
      getBalance()
      
    }
    
  }, [address])



  return (
    <div>
      <h3 className="text-base font-semibold leading-6 text-gray-900">User Profile Statistics</h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item, index) => (
          <div key={index} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.current}  {item.total && <span className="text-sm font-md text-gray-500">/ {item.total}</span>}</dd>
            {index == 0 && address == ownAddress && <Link href="/files"><dd className="mt-1  font-semibold tracking-tight text-cf-600">Show Files</dd></Link>}
          </div>
        ))}
      </dl>
    </div>
  )
}

/* 交流QQ群:7五45737七八 */