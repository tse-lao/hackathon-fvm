import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline"

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  

  
  
export default function Stat({item}) {
    return (
        <div
        key={item.id}
        className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 shadow sm:px-6 sm:pt-6"
      >
        <dt>
          <p className="truncate text-sm font-medium text-gray-500">{item.name}</p>
        </dt>
        <dd className="flex items-baseline pb-6 sm:pb-7">
          <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
          <p
            className={classNames(
              item.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
              'ml-2 flex items-baseline text-sm font-semibold'
            )}
          >
            {item.changeType === 'increase' ? (
              <ArrowUpIcon className="h-5 w-5 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
            ) : (
              <ArrowDownIcon className="h-5 w-5 flex-shrink-0 self-center text-red-500" aria-hidden="true" />
            )}

            <span className="sr-only"> {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
            {item.change}
          </p>
        </dd>
      </div>

    )
}
