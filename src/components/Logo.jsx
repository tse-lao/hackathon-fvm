export function Logo(props) {
    return (
      <svg aria-hidden="true" viewBox="0 0 70 28" {...props}  style={{ fill: 'linear-gradient(148.38deg, #52b36d 17%, #4faa6d 26%, #4a926f 41%, #406c72 60%, #333776 82%, #302878 88%)'}}>
      <linearGradient id="linear-gradient" x1="25.16" y1="11.03" x2="2.07" y2="20.99" gradientUnits="userSpaceOnUse">
      <stop offset=".17" stopColor="#52b36d"/>
      <stop offset=".26" stopColor="#4faa6d"/>
      <stop offset=".41" stopColor="#4a926f"/>
      <stop offset=".6" stopColor="#406c72"/>
      <stop offset=".82" stopColor="#333776"/>
      <stop offset=".88" stopColor="#302878"/>
    </linearGradient>
      
      <path fill="url(#linear-gradient)" d="m26.71,11.33h-8.63l4.31,4.31-7.63,7.63c-1.18,1.02-2.7,1.58-4.26,1.58-2.97,0-5.57-2-6.33-4.87-.14-.55-.22-1.12-.22-1.68,0-3.61,2.94-6.55,6.55-6.55.44,0,.89.05,1.32.13l-2.62,2.62c-1.21.4-2.16,1.34-2.55,2.55l-.02.05c-.12.38-.18.78-.18,1.19,0,2.2,1.79,3.99,3.99,3.99.97,0,1.91-.35,2.64-.99.13-.11,4.93-4.93,5.48-5.48l.15-.15-6.94-6.94h17.55l-2.61,2.61Z"/>
  
      </svg>
    )
  }
  