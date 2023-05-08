import { PlusIcon } from '@heroicons/react/20/solid'

export default function SimpleDecrypted({ startDecrypt }) {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">This file is decrypted</h3>
      <p className="mt-1 text-sm text-gray-500">Please make sure you have access to it to decrypt it.</p>
      <div className="mt-6">
        <button
          type="button"
          onClick={startDecrypt}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          Decrypt file
        </button>
      </div>
    </div>
  )
}
