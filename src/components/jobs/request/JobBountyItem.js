import { UserIcon, WalletIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function JobBountyItem({ details }) {
    return (
        <Link href={`/jobs/request/${details.bountyID}`} key={details.bountyID} className="col-span-1 grid grid-cols-6 justify-between bg-white px-6 border py-2 rounded-md m-4 hover:shadow-md max-w-[600px] self-center place-content-center">
            <div className="col-span-1 flex flex-col justify-center ">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                <WalletIcon height={16}/>
                <span>{details.reward / (10**16)}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-cf-500">
                <UserIcon height={16}/>
                <span>{details.contributors}</span>

                </div>
            </div>
            <div className="col-span-5 flex flex-col">
            <span className="text-md font-bold ">{details.name}</span>   
            <span className="text-gray-700 text-sm truncate">{details.description}</span>
            </div>

        </Link>

    )
}
