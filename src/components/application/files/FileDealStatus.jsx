
export default function FileDealStatus({dealStatus}) {
/*       
    chainDealID: '23410543',
    endEpoch: '3082739',
    publishCID: 'bafy2bzacedcnpdjwdibrqw6wisnyc7lepswfqs5q6jwwtgch4kahhwjutdaia',
    storageProvider: 'f022352',
    dealStatus: 'Announcing',
    bundleId: '5a9075d4-eaf5-4709-bc9d-7cf0df9169ea',
    dealUUID: 'd99c306b-2d88-410a-a1cb-8cc4de4e515a',
    startEpoch: '2564339',
    providerCollateral: '3.024 mFIL',
    lastUpdate: 1675077221346,
    dealId: 23410543,
    miner: 'f022352',
    content: 239214 */
    const renderValue = (value) => {
        if (typeof value === 'object') {
          return JSON.stringify(value);
        }
        return value;
      };
    
  return (
    <div>
    <h3 className="font-medium text-gray-900">FileDealStatus</h3>
    <dl className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
    
    {
    dealStatus ? Object.entries(dealStatus).map(([key, value], index) => (
        <div className="flex justify-between py-3 text-sm font-medium" key={index}>
        <dt className="text-gray-500">{key}</dt>
        <dd className="text-gray-900">{renderValue(value)}</dd>
      </div>
    ))
    : null}

  </dl>
    </div>

  )
}
