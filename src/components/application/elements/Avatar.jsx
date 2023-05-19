
import Blockies from 'react-blockies';
export default function Avatar({height, size, creator}) {

    return (

        <Blockies
          seed={creator || '0x000000'}
          size={size || 10} 
          scale={6} 
          color="#dfe" 
          bgColor="#4eb36d" 
          spotColor="#abc"
          className='rounded-full'
        />
      
    )
}
