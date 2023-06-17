"use client"
import { useEffect, useState } from 'react';
import { useAccount, useBalance, useConnect, useNetwork } from 'wagmi';
import ProfileDetails from '../../profile/ProfileDetails';

export default function LoginButton() {
  const { connect, connectors } = useConnect();
  const { address, status, isConnected, isConnecting, isReconnecting, isDisconnected } = useAccount();
  const { chain } = useNetwork()
  const [showModal, setShowModal] = useState(false);
  const {data:balance} = useBalance({address:address})

  // Eager connection
  useEffect(() => {
    if (!isDisconnected) return;
    const wagmiConnected = localStorage.getItem('wagmi.connected');
    const isWagmiConnected = wagmiConnected ? JSON.parse(wagmiConnected) : false;

    if (!isWagmiConnected) return;

    connect({ connector: connectors });
  }, []);
  
  function truncateTextMiddle(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
  
    const halfLength = Math.floor((maxLength - 3) / 2); // Subtracting 3 to accommodate for the ellipsis
  
    const start = text.slice(0, halfLength);
    const end = text.slice(-halfLength);
  
    const truncatedText = start + '...' + end;
    return truncatedText;
  }
  



  if (isConnecting) {
    return (
      <div className="text-md text-white bg-cf-500 rounded-full py-1 px-8" >
        Loading
      </div>
    )
  }

  if (!isConnecting && address) {
    return (
      <div className="flex rounded-md  items-center gap-2">
        <div className='p-2 flex gap-2'>
          {status === 'connected' &&
            (chain.id == 80001 ? <img src="https://upload.wikimedia.org/wikipedia/commons/8/8c/Polygon_Blockchain_Matic_Logo.svg" alt={`${chain.id}`} className="w-6 h-6" /> :
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Filecoin.svg" alt={`${chain.id}`} className="w-6 h-6" />
            )}
            {balance && Math.round(balance.formatted * 100000)/100000}
        </div>
        <button className='w-[150px] bg-white p-1 px-1 outline rounded-full outline-gray-200 text-sm overflow truncate' onClick={() => setShowModal(!showModal)}>
          {truncateTextMiddle(address, 11)}
          
          {showModal && <ProfileDetails address={address} showModal={showModal} setShowModal={setShowModal} />}

        </button>
      </div>

    )
  }

  if (!isReconnecting && !isConnected && !isConnecting && !address) {

    return (
      <div className="flex gap-4 items-center">
        <div className='flex gap-4'>
          {!isReconnecting && !isConnected && (

            connectors.map((connector) =>
            (
              <button className="text-md text-white bg-cf-500 rounded-full py-1 px-8" key={connector.id} onClick={() => connect({ connector })}>
                {connector.name}
              </button>
            )
            ))}
        </div>
      </div>

    );
  }

  return (
    <div className="text-md text-white bg-cf-500 rounded-full py-1 px-8" >
      Loading
    </div>
  )

}

