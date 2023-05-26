import ClientOnly from '@/hooks/clientOnly';
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';
import ProfileDetails from '../../profile/ProfileDetails';

export default function LoginButton() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const { address, status, isConnected, isConnecting, isReconnecting, isDisconnected } =
    useAccount();
  const { chain } = useNetwork()
  const [showModal, setShowModal] = useState(false);

  // Eager connection
  useEffect(() => {
    if (!isDisconnected) return;
    const wagmiConnected = localStorage.getItem('wagmi.connected');
    const isWagmiConnected = wagmiConnected ? JSON.parse(wagmiConnected) : false;

    if (!isWagmiConnected) return;

    connect({ connector: connectors });
  }, [connect, connectors]);



  return (
    <ClientOnly>
      <div className="flex gap-4 items-center">
        {address &&
        <button className='w-[150px] bg-gray-100 p-1 px-3 outline rounded-full outline-gray-200 text-sm overflow truncate' onClick={() => setShowModal(!showModal)}>
          {address}
        </button>
        }
        <span className='text-sm'>
        {status === 'connected' && 
 
           (chain.id == 80001 ? <img src="https://upload.wikimedia.org/wikipedia/commons/8/8c/Polygon_Blockchain_Matic_Logo.svg" alt={`${chain.id}`} className="w-6 h-6" /> :
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Filecoin.svg" alt={`${chain.id}`} className="w-6 h-6" />
          
          )}
      </span>
        <div className='flex gap-4'>
          {isReconnecting  ? (
            <button>Loading</button>
          ) : !isConnected && (

            connectors.map((connector) => {
              return (
                <button className="text-md text-white bg-cf-500 rounded-full py-1 px-8" key={connector.id} onClick={() => connect({ connector })}>
                  {connector.name}
                </button>
              );
            })
          )}
        </div>
      </div>
      
      {showModal && <ProfileDetails address={address} showModal={showModal} setShowModal={setShowModal} />}

    </ClientOnly>

  );

}

