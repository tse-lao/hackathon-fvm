
export default function RequestElement({index, request}) {
  return (
    <div
    key={index}
    className="p-4 bg-white rounded-lg shadow-md border border-gray-200 mb-4"
  >
    <h2 className="text-xl font-semibold mb-2">{request.title}</h2>
    <p className="text-gray-600">{request.description}</p>
    <p className="text-sm text-gray-400 mt-2">Requested by: {request.name}</p>
  </div>
  )
}
