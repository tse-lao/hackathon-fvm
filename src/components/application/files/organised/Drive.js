import { useAccount } from 'wagmi';
import Folders from './Folders';


export default function Drive() {
   const {address} = useAccount
  return (
    <div>
        <Folders address={address} />
    
        
        
    </div>
  );
}
