import UploadModal from '@/components/UploadModal';
import Drive from '@/components/application/files/organised/Drive';
import { useIsMounted } from '@/hooks/useIsMounted';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import Layout from '../Layout';

export default function Files() {
    const mounted = useIsMounted();
    const { address } = useAccount();
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const openModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        mounted &&(
            <Layout title='Files' active="Files">

                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-base font-semibold leading-6 text-gray-900">Files</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                Below find all the files uploaded by you.
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
                    <Drive address={address} />
                </div>
                {isModalOpen && <UploadModal onClose={() => setIsModalOpen(false)} />}
            </Layout>
        )

    )
}
