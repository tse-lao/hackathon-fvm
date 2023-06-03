import Link from 'next/link'
import CardTitle from '../application/elements/text/CardTitle'

export default function JobItem({ details }) {
    return (
        <Link href={`/jobs/${details.id}`} className='p-8 outline-top hover:bg-gray-100 bg-white shadow rounded-md '>
            <CardTitle title={details.name} />
            <span className='text-sm text-gray-700 overflow-auto'>
                {details.description}
            </span>
        </Link>

    )
}
