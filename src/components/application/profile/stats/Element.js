
export default function ProfileElement({index, item}) {
  return (
    <div key={index} className="overflow-hidden rounded-lg px-4 py-5 sm:p-6 bg-white">
            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.current}  {item.total && <span className="text-sm font-md text-gray-500">/ {item.total}</span>}</dd>
          </div>
  )
}
