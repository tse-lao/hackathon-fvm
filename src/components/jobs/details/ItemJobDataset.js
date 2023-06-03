
export default function ItemJobDataset({data}) {

  return (
    <div className='flex bg-white text-gray-800 my-4 px-6 py-4 shadow rounded-md justify-evenly hover:focus-cf-400 text-left'>
        <a href={`/market/${data.id}`} className="text-cf-500">{data.name}</a> 
        <span>{data.owner}</span> 
        <span>{data.rows} rows</span> 
        <span className="text-cf-500 font-bold" >{data.price}</span> 
    </div>
  )
}
