
export default function DataNotFound({ message }) {
    return (
        <div className="text-center py-8 outline-dashed p-8 shadow rounded-md flex flex-col gap-4">
            <span className="text-gray-900 text-xl font-medium">{message}</span>
            <span className="text-gray-400 text-md">Check back later to see if its updated.</span>
        </div>
    )
}
