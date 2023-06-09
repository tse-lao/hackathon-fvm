import ModalLayout from '@/components/ModalLayout';
import { usePolybase } from '@polybase/react';
import { ethers } from 'ethers';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';
import ProfileBalance from './stats/ProfileBalance';
export default function ProfileDetails({ showModal, open, setShowModal }) {

  const { disconnect } = useDisconnect();
  const [maticBalance, setMaticBalance] = useState(0);
  const [fileBalance, setFileBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const { chain } = useNetwork();
  const polybase = usePolybase();

  const { address, isConnected } =
    useAccount();
  useEffect(() => {
    //balance get rom different api connecters. 
    const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');
    const balance = provider.getBalance(address).then((balance) => {
      setMaticBalance(Math.round(ethers.utils.formatEther(balance) * 10000) / 10000)
    });
    let provider2 = new ethers.providers.JsonRpcProvider('https://filecoin-calibration.chainup.net/rpc/v1	');
    const balance2 = provider2.getBalance(address).then((balance) => {
      setFileBalance(Math.round(ethers.utils.formatEther(balance) * 10000) / 10000);
      console.log(balance)
      setLoading(false)
      
      //check for address 
      
      
      getName();
    });
  }, [address]);

  
  async function getName() {
    const data = await polybase.collection("Profile").where("id", "==", address).get();
    console.log(data.data)
  
  }

  async function copyAddress() {
    navigator.clipboard.writeText(address)
    toast.success("Copied to clipboard")
  }

  return (
    <ModalLayout showModal={showModal} onClose={setShowModal}>
      {isConnected ? (

        <div className='flex flex-col divide-y divide-solid'>
          <div id="username" className='py-4'>
            <span>{name}</span>
            <div className='text-xs text-center py-1 rounded hover:bg-gray-300 cursor-context-menu'
              onClick={() => copyAddress()}
            >
              {address}
            </div>

          </div>
          <div id="balances" className='grid grid-cols-2 py-4'>

            <ProfileBalance loading={loading} token="filecoin" balance={fileBalance} />
            <ProfileBalance loading={loading} token="matic" balance={maticBalance} />

          </div>
          <div className="grid grid-cols-2 p-4 gap-2">
            <Link
              href="/profile/settings"
              className=' font-bold  px-3 rounded-md py-4 text-center hover:bg-gray-400'
            >
              Setting
            </Link>
            <button
              className='text-red-500 py-4 font-bold hover:bg-red-400   px-3 rounded-md'
              onClick={() => { disconnect(); setShowModal(false) }}
            >
              Disconnect
            </button>



          </div>
        </div>


      ) : (
        <p>Not connected</p>
      )}
    </ModalLayout>
  )
}
