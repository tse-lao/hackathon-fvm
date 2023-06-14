import AttributeTable from '@/components/application/data/AttributeTable';
import { ActionButton } from '@/components/application/elements/buttons/ActionButton';
import { DownloadButton } from '@/components/application/elements/buttons/DownloadButton';
import { OpenButton } from '@/components/application/elements/buttons/OpenButton';
import CreateDeal from '@/components/marketplace/CreateDeal';
import DataFormatPreview from '@/components/marketplace/DataFormatPreview';
import ProductDetailTab from '@/components/marketplace/ProductDetailTab';
import { useContract } from '@/hooks/useContract';
import { downloadCid } from '@/hooks/useLighthouse';
import Layout from '@/pages/Layout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';

export default function OpenDataSet() {
  const router = useRouter();
  const { id } = router.query;
  const { hasAccess } = useContract();
  const { address } = useAccount();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState({});
  const [price, setPrice] = useState(0);
  const [owned, setOwner] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showDataformat, setShowDataformat] = useState(false);
  const { mint } = useContract();

  useEffect(() => {
    if (id > 0 && address) {
      getNFT();
    }
  }, [id, address]);

  const startDownload = async () => {
    try{
        
        //get the cbCID based on the treattype. 
      console.log(detail.attributes[1].value)  
      await downloadCid(detail.attributes[1].value, address, id);
      
      toast.success("Succesfully downloaded enjoy!");
    }catch(e){
      toast.error("Error Downloading NFT");
    }  

  }
  
  const getNFT = async () => {
    setLoading(true);
    //
    const result = await fetch(`/api/tableland/opendata/single?tokenID=${id}`);
    const data = await result.json();
    
    console.log(data.result[0]);
    setDetail(data.result[0])

    await fetch(`/api/blockchain/access?address=${address}&id=${id}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data) {
          setOwner(true);
        }
      })
    setLoading(false);
  }


  
  const createDeal = async () => {
    toast.info("Creating Deal...");
    
  
  }



  return (
    <Layout title="Market" active="Market">
      <div className="mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-5 xl:gap-x-16">
          <div className="bg-white p-6 mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
            <div className="flex flex-col-reverse">
              <div className="mt-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {detail.name}
                </h1>
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

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 content-center">
                  <DownloadButton onClick={startDownload} />
              
              <ActionButton text="Deals" onClick={() => setModalOpen(!modalOpen)}/>
              <OpenButton text={showDataformat ? "Hide Format" : "Show Format"} onClick={() => setShowDataformat(!showDataformat)} />
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
            <ProductDetailTab tokenID={id} dataFormat={detail.dataFormatCID} dbCID={detail.dbCID}/>
          </div>
        </div>
      </div>
      {modalOpen &&<CreateDeal cid={detail.dbCID} onClose={() => setModalOpen(false)} />}

    </Layout>
  )
}
