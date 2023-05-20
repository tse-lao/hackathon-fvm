import AttributeTable from '@/components/application/data/AttributeTable';
import DataFormatPreview from '@/components/marketplace/DataFormatPreview';
import ProductDetailTab from '@/components/marketplace/ProductDetailTab';
import { DB_main } from '@/constants';
import { useContract } from '@/hooks/useContract';
import { downloadNFT } from '@/hooks/useLighthouse';
import Layout from '@/pages/Layout';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';


export default function TokenID() {
  const router = useRouter();
  const { id } = router.query;
  const {hasAccess} = useContract();
  const {address} = useAccount();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState({});
  const [price, setPrice] = useState(0);
  const [owned, setOwner] = useState(false);
  const [showDataformat, setShowDataformat] = useState(false);
  const { mint } = useContract();

  useEffect(() => {

    const getNFT = async () => {
      setLoading(true);
      const result = await fetch(`/api/tableland/token?${DB_main}.tokenID=${id}`);
      const data = await result.json();
      setDetail(data.result)      
      setPrice(data.price);
      
        await fetch(`/api/blockchain/access?address=${address}&id=${id}`)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if(data) {
            setOwner(true);
          }
        })
      setLoading(false);
    }
    if (id > 0 && address) {
      getNFT();
    }
  }, [id, address]);

  const startDownload = async () => {
   
   const download =  downloadNFT(detail.dbCID, address, id);
    if (download) {
      toast.success("NFT Downloaded Successfully!");
    }
  }


  const mintNFT = async () => {
    toast.info("Minting NFT...");
    const mintingPrice = ethers.utils.parseEther(price.toString());
    const startMinting = await mint(parseInt(id), mintingPrice)
    if (startMinting) {
      toast.success("NFT Minted Successfully!");
      window.location.reload();
    }
  }

 

  return (
    <Layout title="Market" active="Market">
      <div className="mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        {/* Product */}
        <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-5 xl:gap-x-16">
          {/* Product image */}
           {/* Product details */}
           <div className="bg-white p-6 mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
           <div className="flex flex-col-reverse">
             <div className="mt-4">
               <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{detail.dbName}</h1>

               <h2 id="information-heading" className="sr-only">
                 Product information
               </h2>
               <p className="mt-2 text-sm text-gray-500">
                 {detail.dbCID} {detail.name} (Updated{' '}
                 <time dateTime={detail.datetime}>{detail.tokenID}</time>)
               </p>
             </div>


           </div>

           <p className="mt-6 text-gray-500">{detail.description}</p>

           <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
           {owned ? (
            <button
               type="button"
               onClick={() => startDownload()}
               className="flex w-full items-center justify-center rounded-md border border-transparent bg-cf-600 px-8 py-3 text-base font-medium text-white hover:bg-cf-700 focus:outline-none focus:ring-2 focus:ring-cf-500 focus:ring-offset-2 focus:ring-offset-gray-50"
             >
               Download
             </button>
           ): (
            <button
               type="button"
               onClick={mintNFT}
               className="flex w-full items-center justify-center rounded-md border border-transparent bg-cf-600 px-8 py-3 text-base font-medium text-white hover:bg-cf-700 focus:outline-none focus:ring-2 focus:ring-cf-500 focus:ring-offset-2 focus:ring-offset-gray-50"
             >
               Pay {price} MTC
             </button>
           )}
           
           <button
           type='button'
           onClick={() => setShowDataformat(!showDataformat)}
           className="flex w-full items-center justify-center rounded-md border border-cf-600  px-8 py-3 text-base font-medium text-cf-500 hover:bg-cf-100 focus:outline-none focus:ring-2 focus:ring-cf-500 focus:ring-offset-2 focus:ring-offset-gray-50"
           >
            Show format
           </button>
           </div>

           <div className="mt-10 border-t border-gray-200 pt-10">
             <div className="prose prose-sm mt-4 text-gray-500 flex flex-wrap gap-2">
               {detail.attributes &&
                 <AttributeTable data={detail.attributes} />
                }
             </div>
           </div>
         </div>
          <div className="lg:col-span-4 lg:row-end-1">
            <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg bg-gray-100">
              {detail.dataFormatCID && showDataformat && <DataFormatPreview cid={detail.dataFormatCID} />}
            </div>
          </div>
          <div className="mx-auto w-full max-w-2xl lg:col-span-4 lg:mt-0 lg:max-w-none">
            <ProductDetailTab tokenID={id} dataFormat={detail.dataFormatCID}/>
          </div>
        </div>
      </div>


    </Layout>
  )
}
