'use client'
import { MultisigOwnersTable } from '@/constants/tableland';
import { useEffect, useState } from 'react';
import GroupView from './GroupView';
export default function GetGroup({ address }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    getData(address);
  }, [address])


  async function getData(address) {
    console.log(address)
    const res = await fetch(`https://testnets.tableland.network/api/v1/query?statement=SELECT * FROM ${MultisigOwnersTable} WHERE multisigAddress='${address}'`)

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const result = await res.json();
    console.log(result);
    let resultData = []


    for (let i = 0; i < result.length; i++) {
      console.log(result[i].ownerAddress)
      resultData.push(result[i].ownerAddress);
    }

    setData(resultData);

  }

  return <GroupView members={data} />

}




