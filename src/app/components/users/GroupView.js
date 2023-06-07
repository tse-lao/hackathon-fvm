import GroupUser from "./GroupUser";

export default function GroupView({ members }) {
    return (
        <div>
            <span className="m-4 text-gray-600">Members {members.length}</span>
            <div className="bg-white  divide-y divide-solid border rounded-md mt-4">
                {members.map((member) => (
                    <GroupUser detail={member} />
                ))}
            </div>
        </div>

    )
}