
export default function GroupUser({ detail, add }) {
    return (
        <div key={detail} className="py-4 flex space-x-2 bg-white rounded-md">
            <span className="text-sm font-medium text-gray-500 ml-4 mr-4">{detail}</span>
            {add && <span>X</span>}
        </div>
    )
}
