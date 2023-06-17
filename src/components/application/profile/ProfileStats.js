"use client"
import { formatBytes } from '@/lib/helpers';
import lighthouse from '@lighthouse-web3/sdk';
import { useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import ProfileElement from './stats/Element';

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

      const balance = await lighthouse.getBalance(address);
      newStats.push(
        {
          name: 'Data Used',
          current: formatBytes(balance.data.dataUsed),
          total: formatBytes(balance.data.dataLimit)
        })

      const res = await fetch(`/api/tableland/contributions/count?creator=${address.toLowerCase()}`);
      const data = await res.json();


      newStats.push(
        {
          name: 'Contributions',
          current: data,

        });

        if(userBalance){
          newStats.push(
        {
          name: 'Balance',
          current: Math.round(userBalance.formatted * 10000) / 10000,
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
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item, index) => (
          <ProfileElement key={index} item={item} index={index}/>
        ))}
      </dl>
    </div>
  )
}

/* 交流QQ群:7五45737七八 */