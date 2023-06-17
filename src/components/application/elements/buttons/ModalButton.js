export function ModalButton({ onClick, text }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex items-center justify-center rounded-full border bg-cf-600  px-8 py-2 text-base font-medium text-white hover:bg-cf-800 focus:outline-none focus:ring-2 focus:ring-cf-500 focus:ring-offset-2 focus:ring-offset-gray-50"
      >
        {text}
      </button>
    );
  }