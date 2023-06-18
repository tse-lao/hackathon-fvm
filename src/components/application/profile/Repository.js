
import { GroupListItem } from "@/components/groups/GroupListItem";
import { MultisigOwnersTable } from "@/constants/tableland";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import LoadingEmpty from "../elements/loading/LoadingEmpty";

export default function Groups() {
  const [data, setData] = useState([])
  const {address} = useAccount();
  const [loading,setLoading] = useState(true)

  useEffect(() => {
    async function getData() {
      
      let query = `WHERE ${MultisigOwnersTable}.ownerAddress='${address.toLowerCase()}'`
      const res = await fetch(`/api/tableland/multisig/all?where=${query}`)
      // The return value is *not* serialized
      // You can return Date, Map, Set, etc.

      const result = await res.json();
      
      console.log(result);
      setData(result.result);
      setLoading(false)
    }

    getData();

  }, [])



  if(loading) return <LoadingEmpty />
  return (
    <div>
      <div className="grid lg:grid-cols-2 sm:grid-cols-1 flex-col justify-center">
        {data.length > 0 && data.map((detail, key) => (
          <GroupListItem key={key} detail={detail} />
        ))}
      </div>

      <Link
        className="fixed bottom-12 right-12 bg-cf-500 text-white px-4 py-2 rounded"
        href="/groups/add"
      >
        Create Group
      </Link>
    </div>


  )
}



