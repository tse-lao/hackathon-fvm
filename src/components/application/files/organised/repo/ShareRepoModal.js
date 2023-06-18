
import ModalLayout from '@/components/ModalLayout';
import { ActionButton } from '@/components/application/elements/buttons/ActionButton';
import DataNotFound from '@/components/application/elements/message/DataNotFound';
import { MultisigOwnersTable } from '@/constants/tableland';
import { useContract } from '@/hooks/useContract';
import { shareFile } from '@/hooks/useLighthouse';
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';

export default function ShareRepoModal({ cid, changeOpenModal }) {
    const { submitData, addFileonMultisigFolder } = useContract();
    const { address } = useAccount();
    const [repos, setRepos] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            
            //get all the multisigs
            let query = `WHERE ${MultisigOwnersTable}.ownerAddress='${address.toLowerCase()}'`
            const res = await fetch(`/api/tableland/multisig/all?where=${query}`)
      
            const result = await res.json();
            
            console.log(result);
            setRepos(result.result);
            setLoading(false)
          console.log(data);
          setRepos(data.result);
      
        }
          fetchData();
    
      }, [])

    const handleCheckboxChange = (e) => {
        const checkedValue = e.target.value;
        console.log(e);
        const isChecked = e.target.checked;
    
        if (isChecked) {
          setSelectedOptions((prevSelectedOptions) => [...prevSelectedOptions, checkedValue]);
        } else {
          setSelectedOptions((prevSelectedOptions) =>
            prevSelectedOptions.filter((option) => option !== checkedValue)
          );
        }
      };
    




    const shareToGroup = async (e) => {
        e.preventDefault();

        console.log(selectedOptions)
        if(selectedOptions.length === 0){
            toast.error("Please select a repo to share to.")
            return;
        }
        
        for(let option in selectedOptions){
            console.log(selectedOptions[option])
            
            //TODO: why do we need a tokenID here?
            toast.promise(addFileonMultisigFolder(
                option.tokenID, 
                option.multisigAddress, 
                cid
            ))

            //TODO: check if the access control works.... 
            shareFile(cid, option.multisigAddress, address, option.tokenID)
            
   
        }
        

        // console.log(applyAccess)



        //const signedString = id.concat("", madrid).concat("", count);
        //const getData = await getSignature(signedString);


        //console.log(getData)

        //const arrayAddress = access.map((item) => item.address);
        //console.log(arrayAddress)
    

    };
    

    return (
        <ModalLayout title="Share to group" onClose={changeOpenModal}>
            <div className="flex flex-col gap-4 mt-8">
                <div className="divide-y divide-gray-200 max-h-[400px] overflow-auto outline outline-cf-300 rounded-md ring-cf-200 mb-8">
                    {repos.length > 0 ? repos.map((item, index) => (

                        <label key={index} className={`flex items-center py-4 px-4 hover:bg-gray-100 transition-colors duration-150 cursor-pointer `}>
                            <input
                                type="checkbox"
                                value={{item}}
                                checked={selectedOptions.includes(item)}
                                onChange={handleCheckboxChange}
                                className="form-checkbox text-cf-500 rounded-sm"
                            />
                            <span className="ml-4 text-gray-600 text-md overflow-hidden overflow-ellipsis whitespace-nowrap max-w-full">{item.name}  </span>
                        </label>
                    )) : (
                       <DataNotFound message="No groups available" />
                    )}

                </div>
                <ActionButton text
                    ="Share to group" onClick={shareToGroup} />
            </div>
        </ModalLayout>
    )
}
