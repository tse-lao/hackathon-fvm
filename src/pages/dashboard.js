import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";


// pages/dashboard.js

export default function Dashboard() {
  const { address, connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const {signMessage, data}= useSignMessage();
  const { disconnect } = useDisconnect();

  const messageSigner = async (message) => {
    const result = await signMessage({message: "hello world"});
    console.log(result);
      
  }
  return (
    <div className="main">
    {connectors.map((connector) => {
      return (
        <button className="card" key={connector.id} onClick={() => connect({ connector })}>
          {connector.name}
        </button>
      );
    })}
    {isConnected && (
      <div className="card">
        <div>Account: {address}</div>
        <button onClick={messageSigner}>Sign</button>
        <span>
          {data}
        </span>
        
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    )}
    {error && <div>{error.message}</div>}
  </div>
  );
}