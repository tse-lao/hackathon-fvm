import Link from "next/link";
import StackedLabels from "../elements/StackedLabels";

export default function RequestElement({ index, request }) {
  return (
    <Link
      key={index}
      href={`/request/${request.dbName}/${request.tokenID}`}
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out">
        <div className="flex flex-row justify-between mt-2 items-center">
          <div className="px-6 pt-4 pb-2 items-start	">
            <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-500">{request.dbName}</h3>
          </div>
          <div className="px-6 pt-4 pb-2 ">
        
            {request.attributes && (
              <StackedLabels labels={request.attributes} />
            )}
          </div>
        </div>
        <div className="px-6 py-4 items-center h-[64px]">
          <p className="text-gray-600">{request.description}</p>
        </div>
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-700">
                <strong>Totals Rows:</strong> {request.minimumRowsOnSubmission}
              </p>
            </div>

          </div>
        </div>
      </div>

    </Link>
  )
}