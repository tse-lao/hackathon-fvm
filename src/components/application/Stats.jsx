const stats = [
   
    
  ]
import lighthouse from '@lighthouse-web3/sdk';
import { useEffect, useState } from 'react';
  
  export default function Stats({address}) {
    const [balance, setBalance] = useState(0)
    const [stats, setStats] = useState([
        { name: 'Total Subscribers', stat: '71,897' },
        { name: 'Avg. Open Rate', stat: '58.16%' },
        { name: 'Avg. Click Rate', stat: '24.57%' },
        
    ])
    
    useEffect(() => {
        const getBalance = async () => {
            const balance = await lighthouse.getBalance(address);
            setBalance(balance)
            console.log(balance)
            let newStats = [{
                name: 'Data Limit',
                stat: balance.data.dataLimit
            },
            {
                name: 'Data Used',
                stat: balance.data.dataUsed
            }, 
            
            ]
            setStats(newStats)
        }
        getBalance()
    }, [])


    
    return (
      <div>
        <h3 className="text-base font-semibold leading-6 text-gray-900">Last 30 days</h3>
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
  
  /* 交流QQ群:7五45737七八 */