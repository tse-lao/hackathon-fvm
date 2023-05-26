import Link from 'next/link'
import Category from '../application/elements/Category'

export default function JobItem({ details }) {
    return (
        <Link href={`/jobs/${details.id}`}  className='p-8 outline-top hover:bg-gray-100 bg-white shadow rounded-md '>

                <h1
                    className='text-lg font-bold leading-7 text-gray-700'
                >{details.name}</h1>
                <p className='text-sm text-gray-700 overflow-auto'>
                    {details.description}
                </p>
                <div className='flex flex-row flex-wrap gap-2 mt-4'>
                    {details.categories && details.categories.map((category, index) => (
                        <Category key={index} category={category} />
                    ))}
                </div>

        </Link>

    )
}
