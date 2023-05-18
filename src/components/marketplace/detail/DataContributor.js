import Avatar from "@/components/application/elements/Avatar"
import Link from "next/link"

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function DataContributor({ contribution }) {
    return (
        <Link key={contribution.id} href={`/profile/${contribution.creator}`} className="bg-white hover:bg-gray-300 transition-colors duration-150 cursor-pointer">
            <div className="flex space-x-4 text-sm text-gray-500">
                <div className="flex py-4">

                    <Avatar creator={contribution.creator} size={8} />
                </div>
                <div className={classNames(contribution.index === 1 ? '' : 'border-t border-gray-200', 'py-3')}>
                    <h3 className="font-medium text-gray-900">{contribution.creator}</h3>
                    <p>
                        <time dateTime={contribution.datetime}>{contribution.date}</time>
                    </p>

                    <div   className="prose prose-sm mt-4 max-w-none text-gray-500">
                        <p>{contribution.dataCID}</p>
                        <p>{contribution.rows}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}

