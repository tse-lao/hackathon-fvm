
import Tabs from "@/app/components/navigation/Tabs";
import GroupView from "@/app/components/users/GroupView";
// Dummy data
const members = ['Alice', 'Bob', 'Charlie', 'David'];
const tabs = [
    { name: 'Confirmations', href: '/groups/contributions', current: true },
    { name: 'Jobs', href: '/groups/datasets', current: false },
    { name: 'Files', href: '/groups/files', current: false },
  ]
  

export default function GroupDetailLayout({ children }) {
          return (
            <div className="flex items-center justify-even py-12 px-4 sm:px-6 lg:px-8 flex-wrap gap-12">
              <div className="space-y-8 basis-1/4">
                <div>
                  <h2 className="mt-6  text-2xl font-extrabold text-gray-900">Group Title</h2>
                  <p className="mt-2 text-sm text-gray-600">This description can be anything but needs to be under the 1024 characters</p>
                </div>
                <div className="">
                    <GroupView members={members} />
                </div>
                </div>
                <div className="flex-1 flex-col">
                  <Tabs tabs={tabs} />
                  {children}
                </div>

            </div>
          );
        }
        
        
