import ClientOnly from '@/hooks/clientOnly';
import Blockies from 'react-blockies';
export default function Avatar({height, size, creator}) {

    return (
      <ClientOnly>
      <Blockies
      seed={creator}
      size={size || 10} 
      scale={6} 
      color="#dfe" 
      bgColor="#4eb36d" 
      spotColor="#abc"
      className='rounded-full'
    />
      </ClientOnly>
     
      
          )
}
