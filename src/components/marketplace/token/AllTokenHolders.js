import { getTokenHolder } from '@/hooks/useBlockchain';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AllTokenHolders({ tokenID }) {
    const [holders, setHolders] = useState([]);
    useEffect(() => {
        const fetch = async () => {
            const result = await getTokenHolder(tokenID);
            console.log(result.owners);
            setHolders(result.owners);
        }
        fetch();
    }, [tokenID])
    return (
        <div className='max-h-[400px] overflow-scroll '>
   { holders.map((holder, index) =>  (
            <Link href={`/profile/${holder}`} key={index} >

                <div className='bg-white py-6 m-2 rounded-md text-center hover:bg-cf-100'>{holder}</div>
            </Link>
            ))}
        </div>

    )
}
