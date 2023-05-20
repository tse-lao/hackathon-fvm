import { useState } from 'react';
import { useAccount } from 'wagmi';
import ModalLayout from '../ModalLayout';

export default function CreateOpenDS({ tokenId, onClose }) {
    const { address } = useAccount();


    const [loading, setLoading] = useState(false);

    const submitOpen = async () => {
        setLoading(true)


        setLoading(false)
    }

    return (
        <ModalLayout title="Create Open Dataset" onClose={onClose}>
            <div className='flex flex-col gap-8'>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Required Rows
                    </label>
                    <input
                        type="number"
                        name="requiredRows"
                        id="requiredRows"
                        value={formData.requiredRows}
                        onChange={handleChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Required Rows
        </label>
        <input
          type="number"
          name="requiredRows"
          id="requiredRows"
          value={formData.requiredRows}
          onChange={handleChange}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Required Rows
        </label>
        <input
          type="number"
          name="requiredRows"
          id="requiredRows"
          value={formData.requiredRows}
          onChange={handleChange}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
            </div>
        </ModalLayout>
    )
}
