  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  
  export default function Tabs({tabs, selected, active}) {
    
    return (
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 focus:border-cf-500 focus:ring-cf-500"
            defaultValue={tabs.find((tab) => tab.current).name}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="isolate flex divide-gray-200 rounded-lg " aria-label="Tabs">
            {tabs.map((tab, tabIdx) => (
              <div
                onClick={() => selected(tab.name)}
                href={tab.href}
                key={tabIdx}
                className={classNames(
                  active == tab.name ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
                  tabIdx === 0 ? 'rounded-l-lg' : '',
                  tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
                  'group relative min-w-0 flex-1 overflow-hidden py-4 px-4 text-center cursor-pointer text-sm font-medium hover:bg-gray-50 focus:z-10'
                )}
                aria-current={tab.current ? 'page' : undefined}
              >
                <span>{tab.name}</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    active == tab.name ? 'bg-cf-500' : 'bg-transparent',
                    'absolute inset-x-0 bottom-0 h-0.5'
                  )}
                />
              </div>
            ))}
          </nav>
        </div>
      </div>
    )
  }
  