
import Navigation from '@/components/Navigation'


export default function Layout({children, active}) {
  return (
    <>
      <div className="min-h-full">

      <Navigation active={active}/>
        <main className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 p-12 rounded-md">
          <div >{children}</div>
        </main>
      </div>
    </>
  )
}
