import { ActionButton } from "@/components/application/elements/buttons/ActionButton";
import LoadingFull from "@/components/application/elements/loading/LoadingFull";
import DataNotFound from "@/components/application/elements/message/DataNotFound";
import { DB_main } from "@/constants";
import { useContract } from "@/hooks/useContract";
import Layout from "@/pages/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TagsInput from "react-tagsinput";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";

export default function Repo() {
  const [loading, setLoading] = useState(true);
  const [repo, setRepo] = useState({});
  const [files, setFiles] = useState([]);
  const [access, setAccess] = useState([]);
  const { updateRepoSubmitAccessControl } = useContract();
  const [userAccess, setUserAccess] = useState(false);
  const [newAddresses, setNewAddresses] = useState([]);
  const router = useRouter();
  const { address } = useAccount();
  const { id } = router.query;
  
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`/api/tableland/token/all?where= WHERE  ${DB_main}.tokenID=${id}`);
      const data = await result.json();
      console.log(data.result[0]);
      setRepo(data.result[0]);
      
      setLoading(false);
    }


    setLoading(true);
    if (id) {
      fetchAccess();
      if (userAccess) {
        fetchData();
        fetchFiles();
      }
    }
    
    


  }, [id, userAccess])

  const fetchAccess = async () => {
    const result = await fetch(`/api/tableland/merkle/access?where= WHERE tokenID=${id} `)
    const data = await result.json();
    console.log(data.result)
    
    if(data.result.length < 1){
      return;
    }
    //check if user eists
    const usersFound = data.result.filter((item) => item.address.toLocaleLowerCase() == address.toLocaleLowerCase());
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


  const provideAccess = async () => {

    

    const addresses = access.map((item) => item.address);

    console.log(addresses);
    
    if (addresses.length < 1) {
      toast.error("Could not find the access controls.");
      return;
    }
    let proof = [...addresses, ...newAddresses]; 
    console.log(proof);
    
    toast.promise(updateRepoSubmitAccessControl(
      id, 
      proof
    ), {
      pending: "Submitting Data...",
      success: "Data Submitted.",
      error: "Error submitting data."

    })
  }


  if(loading) return <LoadingFull />

  if (userAccess) {
    return (
      <Layout>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">{repo.dbName}</h2>
          <p className="text-lg mb-4">{repo.description}</p>

          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3">
            {files.length ? files.map((file, index) => (
              <div key={index} className="border rounded-md p-6 bg-white gap-4">
                <Link href={`/files/${file.dataCID}`}>
                  <span className="text-blue-500 hover:underline block overflow-hidden whitespace-nowrap text-sm overflow-ellipsis">{file.dataCID}</span>
                </Link>
                <Link href={`/profile/${file.creator}`}>
                <p className="text-gray-500 text-xs overflow-hidden whitespace-nowrap overflow-ellipsis mt-6">Created by: {file.creator}</p>
                </Link>
              </div>
            )): <DataNotFound message="No files found." />}
            </div>
            <div>
                <div className="">
                  <ul className="">
                    {
                      access.map((item, index) => (
                        <li key={index} className="border rounded-md p-6 bg-white gap-4 m-2">
                          <p className="text-gray-500 text-xs overflow-hidden whitespace-nowrap overflow-ellipsis ">{item.address}</p>
                        </li>
                        ))}
                  </ul>
                        <TagsInput
                          value={newAddresses}
                          onChange={(e) => setNewAddresses(e)}
                        />
                        
                        <ActionButton 
                          onClick={provideAccess}
                          text="Provide Access"
                          />
                </div>
            </div>
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
