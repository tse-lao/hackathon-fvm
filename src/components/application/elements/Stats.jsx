const stats = [


]
import { formatBytes } from '@/lib/helpers';
import lighthouse from '@lighthouse-web3/sdk';
import { useEffect, useState } from 'react';

export default function Stats({ address }) {
  const [stats, setStats] = useState([
    { name: 'Data Used', stat: 'loading...' },
    { name: 'Data Limit', stat: 'loading..' },
    { name: 'Balance', stat: 'loading..' },

  ])

  useEffect(() => {
    const getBalance = async () => {
      const balance = await lighthouse.getBalance(address);
      let newStats = [
        {
          name: 'Data Used',
          stat: formatBytes(balance.data.dataUsed)
        },
        {
          name: 'Data Limit',
          stat: formatBytes(balance.data.dataLimit)
        }


      ]

      setStats(newStats)
    }
    
    getBalance()
  }, [])



  return (
    <div>
      <h3 className="text-base font-semibold leading-6 text-gray-900">Lighthouse Statistics</h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
