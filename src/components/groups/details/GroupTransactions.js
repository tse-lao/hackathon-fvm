import { useEffect } from 'react'

export default function GroupTransactions({address}) {
    useEffect(() => {
      console.log(address)
    }, [address])
    

  return (
    <div>Transactions - {address}</div>
    
    
  )
}
