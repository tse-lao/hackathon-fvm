import Stats from '@/components/application/elements/Stats';
import FileList from '@/components/application/files/FileList';
import { useIsMounted } from '@/hooks/useIsMounted';
import { getLighthouse } from '@/lib/createLighthouseApi';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import Layout from './Layout';

export default function Home() {
  const mounted = useIsMounted();
  const { address } = useAccount();

  const router = useRouter();



  useEffect(() => {
    const setup = async () => {
      const result = await getLighthouse(address);

      if (!result) {
        router.push('/settings/files');
      }

    }

    setup();

  }, [])


  return (
    <Layout active="Dashboard">

      {mounted ? address && (
        <main className='flex flex-col gap-12'>
          <Stats address={address} />
          <FileList address={address} />
        </main>

      ) :
        (
          <main className='flex flex-col gap-12'>
            <div>You need to be logged in to use our application!!</div>
          </main>
        )
      }





    </Layout>
  )
}
