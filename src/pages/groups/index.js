import { GroupListItem } from "@/components/groups/GroupListItem";
import { MultisigOwnersTable } from "@/constants/tableland";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Layout from "../Layout";

export default function Groups() {
  const [data, setData] = useState([])
  const {address} = useAccount();

  useEffect(() => {
    async function getData() {
      let query = `WHERE ${MultisigOwnersTable}.ownerAddress='${address.toLowerCase()}'`
      const res = await fetch(`/api/tableland/multisig/all?where=${query}`)
      // The return value is *not* serialized
      // You can return Date, Map, Set, etc.

      const result = await res.json();
      
      console.log(result);
      setData(result.result);
    }

    if(address == undefined) return;
    getData();

  }, [address])



  return (
    <Layout active="Groups">
      <div className="grid lg:grid-cols-2 sm:grid-cols-1 flex-col justify-center">
        {data.length > 0 && data.map((detail, key) => (
          <GroupListItem key={key} detail={detail} />
        ))}
      </div>
      
      <Link
      className="fixed bottom-12 right-12 bg-cf-500 text-white px-4 py-2 rounded"
      href="/groups/add"
    >
      Create Multisig
    </Link>
    </Layout>
  )
}



