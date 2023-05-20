import { formatBytes, formatDate } from "@/lib/helpers";
import { useAccount } from "wagmi";


export default function FileDetailInformation({detail, metadata, cid}) {
  const {address} = useAccount();

  /* publicKey: '0xa3c960b3ba29367ecbcaf1430452c6cd7516f588',
  fileName: 'flow1.png',
  mimeType: 'image/png',
  txHash: '0x7c9ee1585be6b85bef471a27535fb4b8d7551340152c36c025743c36fd0d1acc',
  status: 'testnet',
  createdAt: 1662880331683,
  fileSizeInBytes: '31735',
  cid: 'QmZvWp5Xdyi7z5QqGdXZP63QCBNoNvjupF1BohDULQcicA',
  id: 'aaab8053-0f1e-4482-9f84-d413fad14266',
  lastUpdate: 1662883207149,
  encryption: true */
    
    
  return (

    <dl className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
    <div className="flex justify-between py-3 text-sm font-medium">
    <dt className="text-gray-500">Size</dt>
    <dd className="text-gray-900">{formatBytes(detail.fileSizeInBytes)}</dd>

  </div>
    <div className="flex justify-between py-3 text-sm font-medium">
      <dt className="text-gray-500">MimeType</dt>
      <dd className="text-gray-900">{detail.mimeType}</dd>
    </div>
    {detail.lastUpdate && (
    <div className="flex justify-between py-3 text-sm font-medium">
      <dt className="text-gray-500">PublicKey</dt>
      <dd className="text-gray-900">{detail.publicKey}</dd>
    </div>
    )}
    {detail.lastUpdate && (
    <div className="flex justify-between py-3 text-sm font-medium">
      <dt className="text-gray-500">Created</dt>
      <dd className="text-gray-900">{formatDate(detail.createdAt, "yyyy-MM-dd HH:mm:ss")}</dd>
    </div>
    )}
    {detail.lastUpdate && (
      <div className="flex justify-between py-3 text-sm font-medium">
      <dt className="text-gray-500">Updated at</dt>
      <dd className="text-gray-900">{formatDate(detail.lastUpdate, "yyyy-MM-dd HH:mm:ss")}</dd>
    </div>
    )}

    <div className="flex justify-between py-3 text-sm font-medium">
      <dt className="text-gray-500">Encryption</dt>
      {detail.encryption ? <dd className="text-cf-500">Yes</dd> : <dd className="text-red-900">No</dd>}
    </div>
  </dl>
  )
}
