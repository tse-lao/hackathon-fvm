import GroupUser from "./GroupUser";

export default function GroupView({ members, addedMembers}) {

    return (
        <div className="w-fit">
            <span className="m-4 text-gray-600">Members </span>
            <div className="bg-white  divide-y divide-solid border rounded-md mt-4">
                {members && members.map((member, key) => (
                    <GroupUser key={key} detail={member} />
                ))}
                {addedMembers  && addedMembers.map((member, key) => (
                    <GroupUser key={key} detail={member} add={true}/>
                ))}
            </div>
        </div>

    )
}