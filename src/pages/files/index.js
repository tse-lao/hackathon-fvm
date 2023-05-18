import FileList from '@/components/application/files/FileList';
import Drive from '@/components/application/files/organised/Drive';
import { useIsMounted } from '@/hooks/useIsMounted';
import { getUploads } from '@/hooks/useLighthouse';
import { getLighthouse } from '@/lib/createLighthouseApi';
import lighthouse from '@lighthouse-web3/sdk';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import Layout from '../Layout';

export default function Files() {
    const mounted = useIsMounted();
    const { address } = useAccount();
    const [loading, setLoading] = useState(true);
    const [organised, setOrganised] = useState(true);


    const getFiles = async () => {
        const apiKey = await getLighthouse(address);
        const data = await lighthouse.dataDepotAuth(apiKey)
        getUploads(data.data.access_token);
        
    }
    return (
        mounted ? address && (
            <Layout title='Files' active="Files">
            
                <main className='flex flex-col gap-12'>

                {organised ? <FileList address={address} /> : <Drive address={address} />}
                </main>
            </Layout>
        ) : (
            <main>
                <div>You need to be logged in to use our application!!</div>
            </main>
        )
    )
}
