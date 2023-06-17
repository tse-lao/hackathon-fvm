import Filecoin from "@/lib/logo/Filecoin"
import Matic from "@/lib/logo/Matic"


export default function ProfileBalance({loading, balance, token}) {
  return (
    <div className="flex flex-row items-center gap-4 hover:bg-gray-50 p-4 rounded-md ">
    <div>
    {token === 'matic' &&    <Matic color="#8247e5" height={32}  /> }
    {token === 'filecoin' &&    <Filecoin height={32}  /> }
    </div>
    <div className="flex flex-col">
      <span className="text-sm text-gray-500 capitalize">{token} balance</span>
      <span className={`text-gray-800 font-bold `}>{loading ? "loading" : balance}</span>
    
    </div>
    </div>

  )
}
