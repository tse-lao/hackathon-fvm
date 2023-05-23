
export default function AccessDenied({ message }) {
    return (
        <div className="text-center py-8 bg-white">
            <p className="text-gray-900 text-xl font-bold uppercase">{message}</p>
            <p className="text-red-600 text-md font-medium mt-6">You don't have access. Please ask the owner to share access</p>
        </div>
    )
}


