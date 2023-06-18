import { ListBulletIcon, UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Category from "../elements/Category";
export default function RequestElement({ index, request }) {

  return (
    <Link
      key={index}
      href={`/request/${request.tokenID}`}
    >
      <div className="bg-white rounded-lg border overflow-hidden hover:shadow transition-shadow duration-200 ease-in-out grid grid-cols-3 p-2">
      <div className="col-span-1 px-6 py-4">
      <div className="flex flex-col justify-between ">

          <span className="text-sm text-gray-700">
             <UserIcon height={16} />{request.creator}
          </span>
          <span className="text-sm text-gray-700">
            <ListBulletIcon height={16}/>
               {request.minimumRowsOnSubmission}
          </span>
      </div>
    </div>
        <div className=" col-span-2 pb-2 items-start	">
          <h3 className="text-md font-semibold mb-1 group-hover:text-indigo-500">{request.dbName}</h3>
          <p className="text-gray-600 text-sm" >{request.description}</p>
        </div>
        <div className="px-6 pt-4 pb-2 ">
          {request.attributes &&
            request.categories.map((item, index) =>
              <Category key={index} category={item} />
            )}
        </div>
        
      </div>

    </Link>
  )
}