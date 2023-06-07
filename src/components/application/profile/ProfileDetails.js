import ModalLayout from '@/components/ModalLayout';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';
import ProfileBalance from './stats/ProfileBalance';
export default function ProfileDetails({ showModal, open, setShowModal }) {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [maticBalance, setMaticBalance] = useState(0);
  const [fileBalance, setFileBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const { chain } = useNetwork();
  const { address, status, isConnected, isConnecting, isReconnecting, isDisconnected } =
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
    });
  }, [address]);


  async function copyAddress() {
    navigator.clipboard.writeText(address)
    toast.success("Copied to clipboard")
  }

  return (
    <ModalLayout showModal={showModal} onClose={setShowModal}>
      {isConnected ? (

        <div className='flex flex-col divide-y divide-solid'>
          <div id="username" className='py-4'>
            <div className='bg-gray-100 outline outline-gray-300 text-center py-3 rounded hover:bg-gray-300 cursor-context-menu	'
              onClick={() => copyAddress()}
            >
              {address}
            </div>

          </div>
          <div id="balances" className='py-4'>
            
             <ProfileBalance loading={loading} balance={fileBalance} />
             <ProfileBalance loading={loading} balance={maticBalance} />
              <div className="flex flex-row items-center gap-4 hover:bg-gray-400 p-4 rounded-md ">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/8c/Polygon_Blockchain_Matic_Logo.svg" className="w-12 h-12" />
                <span className={`text-gray-800 font-bold ${chain.id === 80001 && 'text-green-500'}`}>{loading ? "loading" : maticBalance}
                </span>

              </div>
          </div>
          <div id="actions">
            <div className='flex justify-center'>
              <button className='text-red-500 font-bold bg-red-100 border-red-500 outline py-1 px-3 rounded-md' onClick={() => { disconnect(); setShowModal(false) }}>Disconnect</button>
            </div>
          </div>
        </div>


      ) : (
        <p>Not connected</p>
      )}
    </ModalLayout>
  )
}
