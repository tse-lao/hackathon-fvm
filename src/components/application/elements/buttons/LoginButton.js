import ClientOnly from '@/hooks/clientOnly';
import { useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';

export default function LoginButton() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const { address, status, isConnected, isConnecting, isReconnecting, isDisconnected } =
    useAccount();
  const { chain } = useNetwork()

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
      <div className="flex gap-4">
        <span className='text-sm'>
          {status === 'connected' ? `${chain.name}` : ''}
        </span>
        <span className='w-[200px] text-sm overflow truncate'>
          {address}
        </span>
        <div className='flex gap-4'>
          {isConnecting || isReconnecting ? (
            <button>Loading</button>
          ) : isConnected ? (
            <button onClick={() => disconnect()}>Disconnect</button>
          ) : (

            connectors.map((connector) => {
              return (
                <button className="font-medium text-white bg-indigo-500 rounded-md py-2 px-4" key={connector.id} onClick={() => connect({ connector })}>
                  {connector.name}
                </button>
              );
            })
          )}
        </div>
      </div>
    </ClientOnly>

  );

}

