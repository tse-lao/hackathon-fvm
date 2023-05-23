import Layout from '@/pages/Layout'
import LoadingIcon from './LoadingIcon'

export default function LoadingFull() {
    return (
        <Layout>
            <div className="flex flex-col p-4 text-center align-center py-12 gap-6">
            <LoadingIcon height={124} />
            <h1 className='text-3xl font-bold text-gray-900'>Loading..</h1>
            </div>
        </Layout>
    )
}
