"use client"
import { formatBytes } from '@/lib/helpers';
import lighthouse from '@lighthouse-web3/sdk';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

export default function ProfileStats({ address }) {
  const [stats, setStats] = useState([
    { name: 'Data Used', current: 'loading...', total: 'loading...' },
    { name: 'Contributions', current: 'loading...' },
    { name: 'Balance', current: 'loading...', total: 'loading...' },
  ])

  useEffect(() => {
    const newStats = []
    const getBalance = async () => {
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


      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const userBalance = await provider.getBalance(address)
      newStats.push(
        {
          name: 'Balance',
          current: parseFloat(ethers.utils.formatEther(userBalance, 'ether')).toFixed(6),
        }
      )
      //get current ETH balance
      setStats(newStats)
    }
    
      getBalance()
    
  }, [address])



  return (
    <div>
      <h3 className="text-base font-semibold leading-6 text-gray-900">User Profile Statistics</h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item, index) => (
          <div key={index} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.current}  {item.total && <span className="text-sm font-md text-gray-500">/ {item.total}</span>}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/* 交流QQ群:7五45737七八 */