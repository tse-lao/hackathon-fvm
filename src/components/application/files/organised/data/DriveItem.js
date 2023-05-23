// components/FileItem.js

import { ActionButton } from '@/components/application/elements/buttons/ActionButton';
import { OpenButton } from '@/components/application/elements/buttons/OpenButton';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ShareRepoModal from '../repo/ShareRepoModal';


export default function DriveItem({ file }) {
  const [showModal, setShowModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setShowModal(!showModal);
  };

  const handleCloseModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <div className='col-span-1 flex-col mb-2 bg-white border rounded-md shadow-sm  '>
        <div className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-200" key={file.id}  onClick={handleClick}>
          <div className="flex items-center space-x-4">
            <span className="text-gray-800 text-sm font-medium">{file.name}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500">{file.type}</span>
          </div>


        </div>
        {showModal && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Owner" value={file.owner} />
              <DetailItem label="Piece CID" value={file.carPieceCid} />
              <DetailItem label="Car Payload" value={file.carPayload} />
              <DetailItem label="Car ID" value={file.carId} />
              <DetailItem label="CID" value={file.cid} />
              <DetailItem label="Metadata" value={file.metadata} />
            </div>
            <div className='flex items-center justify-center py-2'>
              <ActionButton onClick={() => router.push(`/files/${file.cid}`)} text="View File" /> 

              <OpenButton onClick={() => setShareModal(!shareModal)} text="Share to Repo" />
            </div>
          
            {shareModal &&  <ShareRepoModal changeOpenModal={setShareModal} cid={file.cid} /> }



          </div>
        )}
      </div>

    </>
  );
};

const DetailItem = ({ label, value, extraStyling = "" }) => (
  <div className={`flex flex-col p-4 `}>
    <span className="font-bold text-gray-600">{label}</span>
    <span className="text-sm text-gray-600 truncate">{value}</span>
  </div>
);


