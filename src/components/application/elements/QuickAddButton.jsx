
export default function QuickAddButton({setOpenModal}) {
    return (
        <button
            onClick={() => setOpenModal(true)}
            className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white w-16 h-16 rounded-full shadow-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                />
            </svg>
        </button>
    )
}


