import { UserIcon, WalletIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function JobBountyItem({ details }) {
    return (
        <Link href={`/jobs/request/${details.bountyID}`} className="flex flex-row gap-4 bg-white px-4 py-4 rounded-md m-4 items-center justify-between
            hover:bg-gray-300
        ">
            <div className="flex flex-col">
                <span className="text-md font-bold ">{details.name}</span>   
                <span className="text-gray-700 text-sm">{details.description}</span>
            </div>
            <div className="flex gap-4 items-center text-cf-600">
                <WalletIcon height={16}/>
                <span>{details.reward / (10**16)}</span>

                <UserIcon height={16}/>
                <span>{details.contributors}</span>

            </div>
            
        </Link>

    )
}
