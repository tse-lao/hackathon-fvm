import GroupView from "@/app/components/users/GroupView"
export default async function GroupInfo({ details, members}) {

  return (
    <div className="space-y-8 basis-1/4">
      <div>
        <h2 className="mt-6  text-2xl font-extrabold text-gray-900">{details.name}</h2>
        <p className="mt-2 text-sm text-gray-600">{details.description}</p>
      </div>
      <GroupView members={members} />
    </div>
  )
}
