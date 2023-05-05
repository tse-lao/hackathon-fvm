import FileList from '@/components/application/files/FileList';
import { useIsMounted } from '@/hooks/useIsMounted';
import { useAccount } from 'wagmi';
import Layout from '../Layout';
export default function Files() {
    const mounted = useIsMounted();
    const { address } = useAccount();


    return (
        mounted ? address && (
            <Layout title='Files' active="Files">
            <main className='flex flex-col gap-12'>
            <FileList address={address} />
            </main>
            </Layout>
        ) : (
            <main>
                <div>You need to be logged in to use our application!!</div>
            </main>
        )
  )
}
