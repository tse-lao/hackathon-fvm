import Link from "next/link";

export default function ContributionItem({contribution}) {
  return (
    <Link href={`/request/${contribution.dbName}/${contribution.tokenID}`}>
        <div className="bg-white px-12 py-6 hover:bg-gray-200">
            <span>{contribution.dbName} {contribution.tokenID}</span>
            <p>{contribution.dataCID}</p>
            <span>{contribution.rows}</span>
            <span></span>
        </div>
    </Link>
  )
}
