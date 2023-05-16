import { EyeIcon } from "@heroicons/react/20/solid";

export default function Stat({ name, icon, total, current, change, href }) {
    return (
        <div className="bg-white rounded-md px-8 py-6">
            <div className="flex gap-6 items-center">
                <div className="h-12 w-12 bg-cf-500 rounded-md">
                    <EyeIcon className="text-white p-2" />
                </div>
                <div>
                    <h1 className="text-sm text-gray-500">{name}</h1>
                    <div>
                        <span className="text-4xl font-bold">{current}</span>
                        {total && <span className="ml-2">/{total}</span> 
                        }   
                    </div>
                </div>
            </div>
        </div>
    )
}
