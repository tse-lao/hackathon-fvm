/* 交流QQ群:七54五7三7七八 */
import { Switch } from '@headlessui/react'
import { useState } from 'react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Toggle({text, status, changeStatus}) {
  const [enabled, setEnabled] = useState(status)

  const changeToggle = () => {
        setEnabled(!enabled)
        changeStatus(!enabled)
    }
  
  return (
    <Switch.Group as="div" className="flex items-center">
      <Switch
        checked={enabled}
        onChange={changeToggle}
        className={classNames(
          enabled ? 'bg-cf-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cf-600 focus:ring-offset-2'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
      <Switch.Label as="span" className="ml-3 text-sm">
        <span className="font-medium text-gray-900">{text}</span>
      </Switch.Label>
    </Switch.Group>
  )
}
