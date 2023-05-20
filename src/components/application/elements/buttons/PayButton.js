export function PayButton({ onClick, price }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-center rounded-md border border-transparent bg-cf-600 px-8 py-3 text-base font-medium text-white hover:bg-cf-700 focus:outline-none focus:ring-2 focus:ring-cf-500 focus:ring-offset-2 focus:ring-offset-gray-50"
      >
        Pay {price} MTC
      </button>
    );
  }