import Contributions from "@/components/application/data/Contributions";
import LoadingSpinner from "@/components/application/elements/LoadingSpinner";
import GrantAccess from "@/components/application/request/GrantAccess";
import DataFormatPreview from "@/components/marketplace/DataFormatPreview";
import { DB_main } from '@/constants';
import { useContract } from "@/hooks/useContract";
import { getSignature, retrieveMergeCID } from "@/hooks/useLitProtocol";
import { getContributionSplit } from "@/hooks/useTableland";
import Layout from "@/pages/Layout";
import { ethers } from "ethers";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function GetRequestDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();
  const [data, setData] = useState(null);
  const [showGrant, setShowGrant] = useState(true);
  const [creator, setCreator] = useState(null);

  const { CreateSpitter, createDB_NFT } = useContract();


  useEffect(() => {
    const getData = async () => {
      
      const result = await fetch(`/api/tableland/token?${DB_main}.tokenID=${id}`);
      const data = await result.json();
      setData(data.result)

    }
    if (id) { getData(); setLoading(false) };
  }, [id])


  const mintNFT = async () => {


    //

    const contributors = await getContributionSplit(tokenId);

    let contract = "0x;"
    let mergedCID = "Qm"

    try {
      const hash = await CreateSpitter(address, contributors.contributors, contributors.percentage);
      console.log(hash);

      contract = hash.events[0].data.replace("0x000000000000000000000000", "0x");
      console.log(contract);
      toast.success("Succesfully generated splitter on address: ", contract);

    } catch (e) {
      toast.error("Error generating splitter.")
      console.log(e);
    }

    try {
      const result = await retrieveMergeCID(tokenId, address);
      console.log(result)
      mergedCID = result;
      toast.success("Succesfully merged CID: " + mergedCID);
    } catch (e) {
      toast.error("Error merging CID.")
      console.log(e);
    }

    const mintPrice = 0.001;

    const price = ethers.utils.parseEther(mintPrice.toString())


    if (mergedCID == "Qm" || contract == "0x") {
      toast.error("Error generating CID or splitter.")
      return;
    }


    console.log(tokenId)
    console.log(mergedCID)
    console.log(mintPrice)
    console.log(contract)

    const toSign = tokenId.concat("", mergedCID).concat("", price).concat("", contract);

    console.log(toSign);
    const sign = await getSignature(toSign);

    try {
      await createDB_NFT(tokenId, mergedCID, mintPrice, contract, sign.v, sign.r, sign.s)
      toast.success("Succesfully minted NFT.")
    }
    catch (e) {
      console.log(e)
      toast.error("Error on minting NFT.")
    }
    //console.log(result);s


  }


  if (loading) return (
    <Layout title="Request">
      <LoadingSpinner loadingText="loading the page..." />
    </Layout>
  );

  return (
    <Layout title="Request">
    {data && (
      <main className="py-10">
        {/* Page header */}
      
        <div className="mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
          <div className="flex items-center space-x-5">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{data.dbName}</h1>
              <Link href={`/profile/${creator}`} className="text-sm font-medium text-gray-500 hover:text-cf-500">
                {creator && (creator)}
              </Link>
            </div>
          </div>
          <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">

            {creator && address && creator.toLowerCase() == address.toLowerCase() && (
              <button
                type="button"
                onClick={mintNFT}
                className="inline-flex items-center justify-center flex-col rounded-md bg-cf-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cf-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <div><span>4/100</span></div>
                <div>Start Minting</div>
              </button>

            )}

          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2 lg:col-start-1">
            {/* Description list*/}

         
              <section aria-labelledby="applicant-information-title">
                <div className="bg-white shadow sm:rounded-lg flex">
                  <div className="bg-gray-100 w-1/3 flex flex-col items-center justify-center">
                    <DataFormatPreview cid={data.dataFormatCID} />
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Description</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {data.description}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Categories</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {data.categories && data.categories.map((category, index) => (

                            <span className="inline-block px-3 py-1 mx-1 text-sm font-semibold text-white bg-indigo-500 rounded-full"

                              key={index}>{category}</span>

                          )
                          )}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Min rows required</dt>
                        <dd className="mt-1 text-sm text-gray-900">{data.minimumRowsOnSubmission}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Metadata Format</dt>
                        <dd className="mt-1 text-sm text-gray-900 overflow-scroll">
                            <Link href={`/metadata/${data.metadataFormatCID}`} className="hover:text-cf-600">
                              {data.dataFormatCID}
                            </Link>
                        </dd>
                        
                      </div>


                    </dl>
                  </div>

                </div>
              </section>


            {/* Comments*/}
            <section aria-labelledby="notes-title">
              <div className="bg-white shadow sm:overflow-hidden sm:rounded-lg">
                <div className="divide-y divide-gray-200">
                  <div className="p-0">
                        <Contributions tokenID={data.tokenID} />
                  </div>
                </div>

              </div>
            </section>
          </div>

          <section aria-labelledby="timeline-title" className="lg:col-span-1 lg:col-start-3">
            <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">

              {showGrant ? (
                <GrantAccess tokenID={data.tokenID} setShowGrant={setShowGrant} address={address} creator={creator} />
              ) : (
                <div>
                  <h2 id="timeline-title" className="text-lg font-medium text-gray-900">
                    Contract Interactions
                  </h2>

                  {/* Activity Feed */}
                  <div className="mt-6 flex flex-col justify-stretch">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      Display all interactions
                    </button>
                  </div>
                </div>
              )}
            </div>

          </section>
        </div>
      </main>
  )}


    </Layout>

  )
}
