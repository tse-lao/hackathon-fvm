import Category from '@/components/application/elements/Category';
import { ethers } from 'ethers';
import Link from 'next/link';

const OpenDataSetItem = ({ dataset }) => {

  const priceAttribute = dataset.attributes.find(attr => attr.trait_type === 'price');
  const priceItem = priceAttribute ? ethers.utils.formatEther(priceAttribute.value) : null;

  return (
    <Link className='col-span-1' href={`/market/open/${dataset.tokenID}`} >
      <div className="bg-white flex rounded-lg overflow-hidden border hover:shadow-md transition-shadow duration-200 ease-in-out items-center">
        <div className="flex flex-row justify-between p-4 items-center">
          <div className="items-start	">
            <h3 className="text-md font-semibold mb-2 group-hover:text-indigo-500">{dataset.name}</h3>
            <span className='text-gray-600 text-sm overflow'>{dataset.description}</span>
          </div>
        </div>
        <div className="items-center right px-4">
          {dataset.categories && dataset.categories.map((category, index) => (
            <Category category={category} key={index} />
          ))}
        </div>
        <div className="px-6 py-4">
        </div>
      </div>
    </Link>
  );
};

export default OpenDataSetItem;
