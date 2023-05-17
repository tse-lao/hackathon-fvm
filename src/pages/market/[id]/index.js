import Category from '@/components/application/elements/Category';
import LoadingSpinner from '@/components/application/elements/LoadingSpinner';
import DataFormatPreview from '@/components/marketplace/DataFormatPreview';
import ProductDetailTab from '@/components/marketplace/ProductDetailTab';
import { useContract } from '@/hooks/useContract';
import { getNFTDetail } from '@/hooks/useTableland';
import Layout from '@/pages/Layout';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';


export default function TokenID() {
    const router = useRouter();
    const { id } = router.query;

    const [loading, setLoading] = useState(true);
    const [detail, setDetail] = useState({});
    const {mint} = useContract();
    useEffect(() => {
        
        const getNFT = async () => {
            const result = await getNFTDetail(id);
            console.log(result);
            setLoading(false);
            setDetail(result)
        }   
        if (id) {
            console.log(`Token ID: ${id}`);
            getNFT();
        }
    }, [id]);

    const mintNFT = async () => {

      toast.info("Minting NFT...");
      //this we will call later directly. 
      
      const mintPrice = "0.001"; 
      const mintingPrice = ethers.utils.parseEther(mintPrice.toString());
      
      
      console.log(id);
      console.log(parseInt(id))
      const startMinting = await mint(parseInt(id), mintingPrice)
      consolel.log(startMinting)
      
    }

      if(loading){ <LoadingSpinner msg="Loading..." />}
  return (
    
    <Layout title="Market" active="Market">
        <div className="mx-auto px-4 py-6 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          {/* Product */}
          <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
            {/* Product image */}
            <div className="lg:col-span-4 lg:row-end-1">
              <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg bg-gray-100">   
                    {detail.dataFormatCID && <DataFormatPreview cid={detail.dataFormatCID} /> }
              </div>
            </div>
  
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
                <button
                  type="button"
                  onClick={mintNFT}
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-cf-600 px-8 py-3 text-base font-medium text-white hover:bg-cf-700 focus:outline-none focus:ring-2 focus:ring-cf-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  Pay {detail.mintPrice} 100 ETH
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-cf-50 px-8 py-3 text-base font-medium text-cf-700 hover:bg-cf-100 focus:outline-none focus:ring-2 focus:ring-cf-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  Preview
                </button>
              </div>
  
              <div className="mt-10 border-t border-gray-200 pt-10">
                <h3 className="text-sm font-medium text-gray-900">Categories</h3>
                <div className="prose prose-sm mt-4 text-gray-500 flex flex-wrap gap-2">
                    {detail.attributes && detail.attributes.map((attribute, index) => (
                      <Category key={index} category={attribute.value}/>
                    ))}

                </div>
              </div>
  
              <div className="mt-10 border-t border-gray-200 pt-10">
                <h3 className="text-sm font-medium text-gray-900">License</h3>
                <p className="mt-4 text-sm text-gray-500">
                  Standard licensing information 
                  <a href="#"  className="font-medium text-cf-600 hover:text-cf-500">
                    Read full license
                  </a>
                </p>
              </div>
  
              <div className="mt-10 border-t border-gray-200 pt-10">
                <h3 className="text-sm font-medium text-gray-900">Share</h3>
                <ul role="list" className="mt-4 flex items-center space-x-6">
                  <li>
                    <a href="#" className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Share on Facebook</span>
                      <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Share on Instagram</span>
                      <svg className="h-6 w-6" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Share on Twitter</span>
                      <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
  
            <div className="mx-auto mt-16 w-full max-w-2xl lg:col-span-4 lg:mt-0 lg:max-w-none">
            <ProductDetailTab />

            </div>
          </div>
        </div>
       
        
    </Layout>
  )
}
