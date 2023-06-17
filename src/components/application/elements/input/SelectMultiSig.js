import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
export default function SelectMultiSig({onChange}) {
    const [addresses, setAddresses] = useState([])
    const {address} = useAccount();


    useEffect(() => {
        //address
        const fetchMultiSig = async () => {
            const result = await fetch(`/api/tableland/multisig/address?address='${address.toLowerCase()}'`);
            const res = await result.json();
            console.log(res)
            if(res.result.length > 0){
                setAddresses(res.result)
            }
        }

        if(!address) return;
        fetchMultiSig()
    }, [address])
    
    const handleChange = (event) => {
        const childValue = event.target.value;
        console.log(childValue)
        onChange(childValue);
      };
  return (
    <select onChange={handleChange}>
        <option >Some option</option>
        {addresses.map((address, key) => (
            <option value={address.multisigAddress} key={key}>{address.name}</option>
        ))}
    </select>
  )
}
