import { useState } from 'react'
import { useAccount, useBalance, useConnect, useSwitchNetwork } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

export default function LoginButton() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { switchNetwork } = useSwitchNetwork() 
  const {getBalance} = useBalance()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const chainLogoUrl = 'URL_TO_LOGO' // Replace with the actual URL to the logo obtained from wagmi


  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center">
        {isConnected ? (
            <div className="text-sm text-gray-500 mr-2">
              {address}
            </div>
           
        ) : (
          <button
            className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={() => connect()}
          >
            Connect Wallet
          </button>
        )}
        <div className="relative ml-4 inline-block">
          <button 
              className="p-1 rounded-full bg-gray-300 inline-flex items-center"
              onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src={chainLogoUrl}
              alt="Chain Logo"
              className="w-4 h-4 object-cover rounded-full"
            />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg p-2 w-64">
              {/* Dropdown menu content */}
              <button
                className="block w-full text-left px-2 py-1 text-sm text-gray-800 hover:bg-gray-100"
                onClick={() => {switchNetwork(80001); setDropdownOpen(false);}}
              >
                Change Chain
              </button>
              <div className="text-sm text-gray-500 mr-2">
              Balance: {getBalance(address)}
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )




}
