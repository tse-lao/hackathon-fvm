import { ethers } from 'ethers';
import Link from 'next/link';
const DatasetItem = ({ dataset }) => {
  
  const priceAttribute = dataset.attributes.find(attr => attr.trait_type === 'price');

  return (
    <Link href={`/market/${dataset.tokenID}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out">
      <div className="flex flex-row justify-between mt-2 items-center">
        <div className="px-6 pt-4 pb-2 items-start	">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-500">{dataset.dbName}</h3>
          <span className="text-cf-600 font-medium text-md ">
              { ethers.utils.formatUnits(priceAttribute.value)} <span className="text-gray-700 ">MATIC</span>
            </span>
        </div>
        <div className="px-6 pt-4 pb-2 ">
          {dataset.attributes && dataset.attributes.map((attribute, index) => (
            attribute.trait_type == "category" &&
            <span key={index} className="inline-block bg-cf-200 rounded-full px-3 py-1 text-sm font-semibold text-cf-700 mr-2 mb-2">{attribute.value}</span>
          ))}
        </div>
        </div>
        <div className="px-6 py-4 items-center">
            
        </div>
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-700">
                <strong>Totals Rows:</strong> {dataset.minimumRowsOnSubmission}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Contributions:</strong> {dataset.totalContributions}
              </p>
            </div>

          </div>
        </div>
      </div>
    </Link>
  );
};

export default DatasetItem;
