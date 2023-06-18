import LoadingFull from '@/components/application/elements/loading/LoadingFull';
import Drive from '@/components/application/files/organised/Drive';
import { useIsMounted } from '@/hooks/useIsMounted';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import Layout from '../Layout';

export default function Files() {
    const mounted = useIsMounted();
    const { address, isConnected } = useAccount();
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const openModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    if(isConnected) {
    return (
            <Layout title='Files' active="Files">

                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-base font-semibold leading-6 text-gray-900">Files</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                Below find all the files uploaded by you.
                            </p>
                        </div>
                    </div>
                    <Drive address={address} />
                </div>
            </Layout>
        )
    }
    return <LoadingFull />
}
