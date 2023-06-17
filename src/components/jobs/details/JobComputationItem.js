
export default function JobComputationItem({data}) {
  return (
    <div className='flex flex-wrap bg-white text-gray-800 my-4 px-6 py-4 shadow rounded-md justify-between items-center'>
        <a href={`/profile/${data.requestor}`} className="font-bold text-cf-500">{data.requestor}</a> 
        <span>{data.inputs}</span> 
        <span>{data.status}</span> 
    </div>
  )
}
