import { ActionButton } from "@/components/application/elements/buttons/ActionButton";
import { OpenButton } from "@/components/application/elements/buttons/OpenButton";
import { useContract } from "@/hooks/useContract";
import Layout from "@/pages/Layout";
import { ethers } from 'ethers';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
export default function Splitterr() {
    const router = useRouter();
    const {contract} = router.query;
  const { getPayeesCount, getPayee, getPayeeShares, distributeShares, getBalance } = useContract();
  const [payeeCount, setPayeeCount] = useState(0);
  const {address} = useAccount();
  const [payees, setPayees] = useState([]);
  const [balance, setBalance] = useState(0);
  const [shares, setShares] = useState({});
  const [isPayee, setIsPayee] = useState(false);

  useEffect(() => {
    async function fetchPayees() {
      const count = await getPayeesCount(contract);
      const payCount = ethers.BigNumber.from(count).toNumber();
      
      const balanceGet = await getBalance(contract);
      setBalance(balanceGet);
      setPayeeCount(payCount);
      const payees = [];
      const shares = {};
      for(let i = 0; i < payCount; i++){
        const payee = await getPayee(contract, i);
        console.log(payee);
        payees.push(payee);
        let share = await getPayeeShares(contract, payee);
        shares[payee] = ethers.BigNumber.from(share).toNumber() / 100;
        
        
      }
      setIsPayee(payees.includes(address));
      setPayees(payees);
      setShares(shares);
    }
    if(contract){fetchPayees()}
  }, [contract]);
  
    const withdrawFunds = async () => {
        if(!isPayee){    
            toast.error("You are not a payee of this contract.");
        }
        
        toast.promise(distributeShares(contract, address), {
            pending: "Withdrawing funds...",
            success: "Funds withdrawn.",
            error: "Error withdrawing funds."
        })
    }
  return (
    <Layout>
    <div className="flex flex-col items-center min-h-screen py-2">
    <div className="max-w-md w-full space-y-8">
      <div className="text-center text-gray-600">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Splitter Contract</h2>
        <p className="mt-2 text-center text-sm ">{contract}</p>
        <p className="mt-2 text-center text-cf-600 text-lg "> {balance} MATIC</p>
        <p className="my-2 text-sm">Payee Count: {payeeCount}</p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 bg-white shadow sm:rounded-lg max-h-[400px] overflow-scroll">
   
        {payees.map(payee => (
          <div key={payee} className="mt-5">
            <p className="text-md text-gray-700">{payee}</p>
            <p className="text-md text-cf-700">Shares: {shares[payee]} %</p>
          </div>
        ))}
      
      </div>
    {isPayee ? (
      <ActionButton onClick={withdrawFunds} text="Distribute Shares" />
    ): (
      <OpenButton text="Only Payees can withdraw funds" disabled={true} />
    )}
    </div>
  </div>
    </Layout>
  );
}
