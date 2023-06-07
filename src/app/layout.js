import '@/styles/tailwind.css';
import 'react-toastify/dist/ReactToastify.css';
import './global.css';


import Navigation from './components/navigation/Navigation';
import GlobalProvider from './providers';

export default function RootLayout({ children }) {
  return (

    <html lang="en">

      <body className='bg-gray-50'>
        <GlobalProvider>
          <Navigation />
          <div className='p-8'>

            {children}

          </div>
        </GlobalProvider>
      </body>

    </html>

  )
}


