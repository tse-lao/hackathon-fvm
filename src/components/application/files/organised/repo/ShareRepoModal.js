import ModalLayout from '@/components/ModalLayout';
import { ActionButton } from '@/components/application/elements/buttons/ActionButton';
import { MerkleHelper } from '@/constants/tableland';
import { useContract } from '@/hooks/useContract';
import { shareAccessToRepo } from '@/lib/shareAccessToRepo';
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';
export default function ShareRepoModal({ cid, changeOpenModal }) {
    const { submitData } = useContract();
    const { address } = useAccount();
    const [repos, setRepos] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    
    useEffect(() => {
        const fetchData = async (id) => {
            const result = await fetch(`/api/tableland/merkle/all?where= WHERE ${MerkleHelper}.address='${address }'`);
            const data = await result.json();
          console.log(data);
          setRepos(data.result);
      
        }
          fetchData();
    
      }, [])

    const handleCheckboxChange = (e) => {
        const checkedValue = e.target.value;
        const isChecked = e.target.checked;
    
        if (isChecked) {
          setSelectedOptions((prevSelectedOptions) => [...prevSelectedOptions, checkedValue]);
        } else {
          setSelectedOptions((prevSelectedOptions) =>
            prevSelectedOptions.filter((option) => option !== checkedValue)
          );
        }
      };
    




    const shareToRepo = async (e) => {
        e.preventDefault();

        console.log(selectedOptions)
        if(selectedOptions.length === 0){
            toast.error("Please select a repo to share to.")
            return;
        }
        
        for(let option in selectedOptions){
            console.log(selectedOptions[option])
            const result = await shareAccessToRepo(selectedOptions[option], cid, address);

            console.log(result);
            toast.promise(submitData(
                result.token,
                result.cid,
                result.count,
                result.array,
                result.index,
                result.v,
                result.r,
                result.s
            ), {
                pending: "Submitting Data...",
                success: "Data Submitted.",
                error: "Error submitting data."
    
            })
            
        }
        //const applyAccess = await applyAccessConditions(madrid);

        // console.log(applyAccess)



        //const signedString = id.concat("", madrid).concat("", count);
        //const getData = await getSignature(signedString);


        //console.log(getData)

        //const arrayAddress = access.map((item) => item.address);
        //console.log(arrayAddress)
     


    };

    return (
        <ModalLayout title="Share to Repo" onClose={changeOpenModal}>
            <div className="flex flex-col gap-4 mt-8">
                <div className="divide-y divide-gray-200 max-h-[400px] overflow-auto outline outline-cf-300 rounded-md ring-cf-200 mb-8">
                    {repos.length > 0 ? repos.map((item, index) => (

                        <label key={index} className={`flex items-center py-4 px-4 hover:bg-gray-100 transition-colors duration-150 cursor-pointer `}>
                            <input
                                type="checkbox"
                                value={item.tokenID}
                                checked={selectedOptions.includes(item.tokenID)}
                                onChange={handleCheckboxChange}
                                className="form-checkbox text-cf-500 rounded-sm"
                            />
                            <span className="ml-4 text-gray-600 text-md overflow-hidden overflow-ellipsis whitespace-nowrap max-w-full">{item.dbName}  </span>
                        </label>
                    )) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-xl font-medium">No data available</p>
                            <p className="text-gray-400 text-md">Please find in descripotion how t.</p>
                        </div>
                    )}

                </div>
                <ActionButton text
                    ="Share Repo Repository" onClick={shareToRepo} />
            </div>
        </ModalLayout>
    )
}
