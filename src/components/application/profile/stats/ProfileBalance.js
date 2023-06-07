import MaticLogo from "@/lib/logo/MaticLogo";

export default function ProfileBalance({loading, balance, token}) {
  return (
    <div className='flex flex-row items-center gap-4'>
      <MaticLogo height={12} />
    <span className={`text-gray-800 font-bold`}>{loading ? "loading.." : balance}</span>
  </div>
  )
}
