
export default function Connected({ connected, msg, handleConnect }) {

    if (connected) {

        return (
            <div className="flex items-center ml-4 m-4">
                <svg className="-ml-0.5 mr-1.5 h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx={4} cy={4} r={3} />
                </svg>
                <span className="text-md overflow-scroll w-full px-4">
                    {msg}
                </span>
            </div>
        )
    }

    return (
        <div className="flex items-center ml-4 space-x-4">
            <svg className="-ml-0.5 mr-1.5 h-4 w-4 text-red-400" fill="currentColor" viewBox="0 0 8 8">
                <circle cx={4} cy={4} r={3} />
            </svg>
            <button
                onClick={handleConnect}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded shadow hover:bg-blue-600 transition-colors duration-200"
            >
                Connect to {msg}
            </button>
        </div>

    );
};
