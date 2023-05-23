import { DB_main } from "@/constants";
import { DB_NFT_address } from "@/constants/contractAddress";
import { useContract } from "@/hooks/useContract";
import { readJWT } from "@/hooks/useLighthouse";
import { shareAccessToRepo } from "@/lib/shareAccessToRepo";
import Layout from "@/pages/Layout";
import lighthouse from "@lighthouse-web3/sdk";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";

export default function Repo() {
  const [repo, setRepo] = useState({});
  const [files, setFiles] = useState([]);
  const [access, setAccess] = useState([]);
  const { submitData, hasAccess } = useContract();
  const [userAccess, setUserAccess] = useState(false);
  const router = useRouter();
  const { address } = useAccount();
  const { id } = router.query;
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`/api/tableland/token/all?where= WHERE  ${DB_main}.tokenID=${id}`);
      const data = await result.json();
      console.log(data.result[0]);
      setRepo(data.result[0]);
    }



    if (id) {
      if (userAccess) {
        fetchData();
        fetchFiles();
      }
      fetchAccess();

    }


  }, [id, userAccess])

  const fetchAccess = async () => {
    const result = await fetch(`/api/tableland/merkle/access?where= WHERE tokenID=${id} AND AccessFor='SUBMIT'`)
    const data = await result.json();
    console.log(data.result)
    //check if user eists
    console.log(address);
    const usersFound = data.result.filter((item) => item.address == address);
    console.log(usersFound)
    if (usersFound.length > 0) {
      setUserAccess(true);
    }

    setAccess(data.result);
  }

  async function fetchFiles() {
    //we want to call the api for this aswel. 
    const result = await fetch(`/api/tableland/contributions?${DB_main}.tokenID=${id}`);

    const data = await result.json();
    console.log(data.result);

    setFiles(data.result);
  }


  const provideData = async () => {

    const result = await shareAccessToRepo(id, madrid, address)

    toast.promise(submitData(
      result.token,
      result.cid,
      result.count,
      result.array,
      result.index,
      result.v,
      result.r,
      result.s
    ), {
      pending: "Submitting Data...",
      success: "Data Submitted.",
      error: "Error submitting data."

    })

  }

  const applyAccessConditions = async (cid) => {

    const result = await getHexProof();

    console.log(result);
    const conditions = [
      {
        id: 1,
        chain: "Mumbai",
        method: "hasRepoAccess",
        standardContractType: "Custom",
        contractAddress: DB_NFT_address,
        returnValueTest: {
          comparator: "==",
          value: "true"
        },
        parameters: [id, result, ":userAddress"],
        inputArrayType: ["uint256", "bytes32[]", "address"],
        outputType: "bool"
      }
    ];



    // Aggregator is what kind of operation to apply to access conditions
    // Suppose there are two conditions then you can apply ([1] and [2]), ([1] or [2]), !([1] and [2]).
    const aggregator = "([1])";
    const jwt = await readJWT(address);


    /*
      accessCondition(publicKey, cid, signedMessage, conditions, aggregator)
        Parameters:
          publicKey: owners public key
          CID: CID of the file to decrypt
          signedMessage: message signed by the owner of publicKey
          conditions: should be in a format like above
          aggregator: aggregator to apply conditions
    */

    console.log(cid);
    const response = await lighthouse.applyAccessCondition(
      address,
      cid,
      jwt,
      conditions,
      aggregator
    );

    console.log(response)

    return response;
    /*
      {
        data: {
          cid: "QmZkEMF5y5Pq3n291fG45oyrmX8bwRh319MYvj7V4W4tNh",
          status: "Success"
        }
      }
    */
  }


  if (userAccess) {
    return (
      <Layout>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">{repoData?.title}</h2>
          <p className="text-lg mb-4">{repoData?.description}</p>

          <div className="grid grid-cols-3 gap-4">
            {files?.map((file, index) => (
              <div key={index} className="border rounded-md p-4">
                <Link href={`/files/${file.dataCID}`}>
                  <span>{file.creator}</span>
                  <a className="text-blue-500 hover:underline">{file.dataCID}</a>
                </Link>
              </div>
            ))}
          </div>
          </div>
      </Layout>
    )
  }

  return (

    <Layout>
      <div className="p-4 text-center bg-white py-12">
        <h2 className="text-2xl  font-bold mb-4">Access Denied</h2>
        <p className="text-lg text-red-500">You do not have access to this repository.</p>
        <p className="text-lg text-gray-500">Please apply for access.</p>
      </div>
    </Layout>
  )


}
