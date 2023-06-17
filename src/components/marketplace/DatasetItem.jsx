import { ethers } from 'ethers';
import Link from 'next/link';
import Category from '../application/elements/Category';
const DatasetItem = ({ dataset }) => {

  const priceAttribute = dataset.attributes.find(attr => attr.trait_type === 'price');
  const priceItem = priceAttribute ? ethers.utils.formatEther(priceAttribute.value) : null;

  return (
    <Link href={`/market/${dataset.tokenID}`} >
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out">
        <div className="flex flex-row justify-between mt-2 items-center">
          <div className="px-6 pt-4 pb-2 items-start	">
            <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-500">{dataset.name}</h3>

          </div>
          <div className="px-6 pt-4 pb-2">
            <span className="text-cf-600 font-medium text-md ">
              {priceItem} <span className="text-gray-700 ">MATIC</span>
            </span>
          </div>
        </div>
        <div className="items-center px-4">
          {dataset.categories && dataset.categories.map((category, index) => (
            <Category category={category} key={index} />
          ))}
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
