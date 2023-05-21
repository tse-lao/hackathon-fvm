import { useContract } from '@/hooks/useContract';
import { useDocument, usePolybase } from '@polybase/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useBlockNumber, useNetwork, useSwitchNetwork } from 'wagmi';
import ModalLayout from '../ModalLayout';
import LoadingSpinner from '../application/elements/LoadingSpinner';
import { ActionButton } from '../application/elements/buttons/ActionButton';
import { OpenButton } from '../application/elements/buttons/OpenButton';

const HYPERSPACE_ID = 3141;
const POLYGON = 80001;
export default function CreateDeal({ cid, onClose }) {
    const polybase = usePolybase();
    const { data, loading } = useDocument(polybase.collection("File").where("cid", "==", cid));
    const { makeDealProposal } = useContract();
    const [makingDeal, setMakingDeal] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [record, setRecord] = useState(null)
    const { chain } = useNetwork()
    const { data:blocknumber, isError, isLoading:blockloading } = useBlockNumber()
    const { switchNetwork } = useSwitchNetwork()
    
    useEffect(() => {
       //make a check here to see if the cid is already in teh database. 
    
       const fetchData = async () => {
        const piece_cid = data.data[0].data.carPayload;
        
        const result = await fetch(`/api/tableland/request/status?piece_cid=${piece_cid}`); 
        const status = await result.json();
        
        if(status.result.length > 0){
            setErrorMessage("This payload had already a pending process...")
        }
       }
       
       if(!loading) {
        fetchData()
       }
    }, [cid, loading])
    

    const makeProposal = async () => {
        setMakingDeal(true);
        let record = data.data[0].data;
        const cidHex = record.cidHex;
        const label = record.carPayload;
        const piece_size = record.pieceSize;
        const start_epoch = blocknumber + 5000;
        
        //TODO get current epoch. 
        
        
        const location_ref = `https://data-depot.lighthouse.storage/api/download/download_car?fileId=${record.carId}.car`;
        const carSize = record.carSize;

        console.log(`${cidHex}:piece_cid, label, ${piece_size} piece_size, ${start_epoch} end_epoch, ${location_ref} location_ref, carSize: ${carSize}`)
        
        
        
        toast.promise(makeDealProposal(location_ref, carSize, cidHex, piece_size, label, start_epoch), {
            pending: 'Creating deal...',
            success: 'Deal created!',
            error: 'Error creating deal',
            }).then((result) => {
                console.log(result)
                setMakingDeal(false);
                setRecord(result)
            })

        
        //useNetwork().switchNetwork(POLYGON)



    }
    if (loading) return <LoadingSpinner />
    return (
        
        <ModalLayout title="Create Deal" onClose={onClose}>
            <div className="flex flex-col w-full h-full py-6 gap-4">
                {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                
                <div className='flex flex-col'>
                    <label className="font-bold">CID</label>
                    <span className='text-sm'>{data.data[0].data.cidHex}</span>
                </div>
                <div className='flex flex-col'>
                    <label className="font-bold">Label</label>
                    <span className='text-sm'>{data.data[0].data.carPayload}</span>
                </div>
                <div className='flex flex-col'>
                    <label className="font-bold">Piece CID</label>
                    <span>{data.data[0].data.pieceSize}</span>
                </div>
                <div className='flex flex-col'>
                    <label className="font-bold">End Epoch</label>
                    <span>1050026</span>
                </div>
                <div className='flex flex-col'>
                    <label className="font-bold">Size</label>
                    <span>{data.data[0].data.carSize}</span>
                </div>
                <div className='flex flex-col'>
                    <label className="font-bold">Size</label>
                    <span>{data.data[0].data.carId}</span>
                </div>
                <div className='flex flex-col'>
                <label className="font-bold">Current Block</label>
                <span>{blocknumber}</span>
                </div>
                {chain.id == HYPERSPACE_ID ? <ActionButton loading={makingDeal} onClick={makeProposal} text="Make Deal" /> : 
                <OpenButton text="Change to HyperSpace"
                    onClick={() => switchNetwork?.(HYPERSPACE_ID)}
                /> }
                   
                </div>
        </ModalLayout>
    )
}
