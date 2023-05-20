import Link from "next/link";

export default function ContributionItem({contribution}) {
  return (
    <Link href={`/request/${contribution.tokenID}`}>
        <div className="bg-white px-12 py-6 hover:bg-gray-200 rounded-md shadow-md">
            <span className="text-gray-600 font-bold">{contribution.dbName} {contribution.tokenID}</span>
            <p>{contribution.dataCID}</p>
            <span className="text-md text-gray-500 italic">Contributed: {contribution.rows}</span>
            <span></span>
        </div>
    </Link>
  )
}
