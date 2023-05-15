export default function RequestElement({ index, request }) {
  return (
    <a
      key={index}
      href={`/request/${request.dbName}/${request.tokenID}`}
    >
      <div
        key={index}
        className="p-4 bg-white rounded-lg shadow-md border border-gray-200 mb-4"
      >
      <h2 className="text-xl font-semibold mb-2">{request.dbName}</h2>
      <p className="text-gray-600">{request.description}</p>
      
      <span>0 /{request.minimumRowsOnSubmission}</span>
      
    </div>
  </a >
  )
}