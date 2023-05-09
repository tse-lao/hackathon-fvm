export default function RequestElement({ index, request }) {
  return (
    <a
      key={index}
      href={`/request/${request.DBname}/${request.tokenID}`}
    >
      <div
        key={index}
        className="p-4 bg-white rounded-lg shadow-md border border-gray-200 mb-4"
      >
      <h2 className="text-xl font-semibold mb-2">{request.DBname}</h2>
      <p className="text-gray-600">{request.dataFormatCID}</p>
      <span>100 /10.000</span>
      <p className="text-sm text-gray-400 mt-2">Created at: {request.description}</p>
    </div>
  </a >
  )
}

