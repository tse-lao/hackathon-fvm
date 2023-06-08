import { CheckIcon, UsersIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

export const GroupListItem = ({ detail }) => {
    return (

        <Link href={`/groups/${detail.multisigAddress}`} key={detail.id} className="col-span-1 grid grid-cols-6 justify-between bg-white px-6 border py-2 rounded-md m-4 hover:shadow-md max-w-[600px] self-center">
            <div className="col-span-1 flex flex-col justify-center ">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <UsersIcon height={16} />
                    <span> {detail.members.length}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-cf-500">
                    <CheckIcon height={16} />
                    <span>  {detail.numberOfConfirmations}</span>
                </div>
            </div>
            <div className="col-span-5 flex flex-col">
                <span className="text-gray-700">{detail.name}</span>
                <span className="text-sm text-gray-400">{detail.multisigAddress}</span>
            </div>

        </Link>
    )
}