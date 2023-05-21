import Table from '@/components/application/data/Table';
import LoadingSpinner from '@/components/application/elements/LoadingSpinner';
import { getUploads } from '@/hooks/useLighthouse';
import { getLighthouse } from '@/lib/createLighthouseApi';
import lighthouse from '@lighthouse-web3/sdk';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import Layout from '../Layout';


export default function Car() {
    const { address } = useAccount();
    const [carFiles, setCarFiles] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const getFiles = async () => {
            const apiKey = await getLighthouse(address);
            const data = await lighthouse.dataDepotAuth(apiKey)
            const result = await getUploads(data.data.access_token, 1);
            console.log(result);
            setCarFiles(result);
            setLoading(false);
        }

        if (address) {
            setLoading(true)
            getFiles();
        }

    }, [address])
    
    const openModal = () => {
        setModalOpen(!modalOpen);
    }

    return (
        <Layout active="files">


            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Car Files {carFiles.length}</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Please you can find all the car files, please not that the car files are different from regular files. 
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-2">
                    <button
                        type="button"
                        onClick={openModal}
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Add file
                    </button>
                </div>


            </div>

            {loading && <LoadingSpinner />}
            {carFiles && carFiles.length > 0 && <Table data={carFiles} />}
        </Layout>
    )
}
