
export default function DataNotFound({ message }) {
    return (
        <div className="text-center py-8 bg-white">
            <p className="text-gray-900 text-xl font-medium">{message}</p>
            <p className="text-gray-400 text-md">Check back later to see if its updated.</p>
        </div>
    )
}
