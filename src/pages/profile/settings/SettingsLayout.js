
import {
  BellIcon,
  CogIcon,
  SquaresPlusIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import Layout from '../../Layout'


const subNavigation = [
  { name: 'Profile', href: '/settings', icon: UserCircleIcon, current: true },
  { name: 'Files', href: '/settings/files', icon: CogIcon, current: false },
  { name: 'Notifications', href: 'notications', icon: BellIcon, current: false },
  { name: 'Integrations', href: '/settings/integrations', icon: SquaresPlusIcon, current: false },
]


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function SettingsLayout({children, active}) {


  return (
    <Layout active="Settings">

      <main className="relative">
        <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-x lg:divide-y-0">
              <aside className="py-6 lg:col-span-3">
                <nav className="space-y-1">
                  {subNavigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.name == active
                          ? 'border-teal-500 bg-teal-50 text-teal-700 hover:bg-teal-50 hover:text-teal-700'
                          : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                        'group flex items-center border-l-4 px-3 py-2 text-sm font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      <item.icon
                        className={classNames(
                          item.name == active
                            ? 'text-teal-500 group-hover:text-teal-500'
                            : 'text-gray-400 group-hover:text-gray-500',
                          '-ml-1 mr-3 h-6 w-6 flex-shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      <span className="truncate">{item.name}</span>
                    </a>
                  ))}
                </nav>
              </aside>
                          

                {children}


            </div>
          </div>
        </div>
      </main>
      </Layout>
  )
}
