import { useContract } from '@/hooks/useContract';
import { useDocument, usePolybase } from '@polybase/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useBlockNumber } from 'wagmi';
import ModalLayout from '../ModalLayout';
import LoadingSpinner from '../application/elements/LoadingSpinner';
import { ActionButton } from '../application/elements/buttons/ActionButton';
import { OpenButton } from '../application/elements/buttons/OpenButton';

export default function CreateDeal({ cid, onClose, getOpen }) {
    const polybase = usePolybase();
    const { data, loading, error } = useDocument(polybase.collection("File").where("cid", "==", cid));
    const { makeDealProposal } = useContract();
    const [makingDeal, setMakingDeal] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [pending, setPending] = useState()
    const [deals, setDeals] = useState([])
    const { data: blocknumber, isError, isLoading: blockloading } = useBlockNumber()

    useEffect(() => {
        //make a check here to see if the cid is already in teh database. 

        const fetchData = async () => {
            const piece_cid = data.data[0].data.carPayload
            const result = await fetch(`/api/tableland/request/status?piece_cid=${piece_cid}`);
            const status = await result.json();
            
            console.log(status)
            
            setDeals(status.result)
            setPending(true)
        }

        if (!loading) {
            
            if(error){
                //then there exist no record for this, we we need to create a deal making record for it
                toast.error("No record found, creating one")
                return;
            }
            
            if(data.data[0]){
                fetchData()
            }
            
            console.log(data);
        }
    }, [cid])


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
            onClose()
        })
    }
    
    const createCarFile = async () => {
        toast.error("Not implemented yet");   
    }
    
    const changeOpen = () => {
        console.log("closed")
    }
    if (loading) return <LoadingSpinner />

if(data.data[0] == undefined)  return (
        <ModalLayout title="Create Deal"  onClose={onClose} getOpen={getOpen} changeOpen={changeOpen}>
            <div className="flex flex-col w-full h-full py-6 gap-4">
                No record found. You first need to make a CAR file before you can make a deal.
            </div>
            <ActionButton  onClick={createCarFile} text="Create Car File" />
        </ModalLayout>   
    )
    return (
        <ModalLayout title="Create Deal"  onClose={onClose} getOpen={getOpen} changeOpen={changeOpen}>


            {pending ? (deals.length > 0 && 
                (
                    <div className='flex flex-col max-h-[400px] px-4 py-4'>
                {deals.map((deal) =>
                //loop over the array and display the deals.
                <div className='flex flex-col'>
                    <RecordItem label="Label" value={deal.piece_cid} />
                    <RecordItem label="Car Size" value={deal.car_size} />
                    <RecordItem label="Location" value={deal.location_ref} />
                    <RecordItem label="Storage" value={deal.storage_price_per_epoch} />
                    <RecordItem label="Timestamp" value={deal.timestampt} />
                    
                    
                    <OpenButton text="Request pending..."  />
                </div>
               
                )}
                </div>
                )) : (
                <div className="flex flex-col w-full h-full py-6 gap-4">
                    {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                    <RecordItem label="CID" value={data.data[0].data.cidHex} />
                    <RecordItem label="Label" value={data.data[0].data.carPayload} />
                    <RecordItem label="Piece CID" value={data.data[0].data.pieceSize} />
                    <RecordItem label="End Epoch" value={1050026} />
                    <RecordItem label="Size" value={data.data[0].data.carSize} />
                    <RecordItem label="Id" value={data.data[0].data.carId} />
                    <RecordItem label="Current Block" value={blocknumber} />

                <ActionButton loading={makingDeal} onClick={makeProposal} text="Make Deal" /> 

                </div>
            )}

        </ModalLayout>
    )
}

const RecordItem = ({ label, value }) => (
    <div className="flex flex-col">
        <label className="font-bold">{label}</label>
        <span>{value}</span>
    </div>
)