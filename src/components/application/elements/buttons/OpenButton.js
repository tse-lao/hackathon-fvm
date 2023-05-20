export function OpenButton({ onClick, text }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-center rounded-md border border-cf-600  px-8 py-3 text-base font-medium text-cf-500 hover:bg-cf-100 focus:outline-none focus:ring-2 focus:ring-cf-500 focus:ring-offset-2 focus:ring-offset-gray-50"
      >
        {text}
      </button>
    );
  }