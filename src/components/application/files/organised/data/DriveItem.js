// components/FileItem.js

import { FolderIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';


export default function DriveItem({ file }) {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowModal(!showModal);
  };

  const handleCloseModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <div className='flex flex-col mb-2 bg-white border rounded-md shadow-sm  '>
        <div className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-200" key={file.id}  onClick={handleClick}>
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gray-200 rounded-full">
              {file.type === null ? (
                <FolderIcon className="fas fa-folder text-yellow-500" />
              ) : (
                <PhotoIcon className="fas fa-file text-blue-500" />
              )}
            </div>
            <span className="text-gray-800 font-medium">{file.name}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{file.type}</span>
            <span className="text-sm text-gray-500">{file.addedAt}</span>
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
              <Link
                className='px-4 py-2 text-lg font-bold text-indigo-600 rounded-md z-index-5'
                href={`/files/${file.cid}`}
              >
                View File
              </Link>
            </div>




          </div>
        )}
      </div>

    </>
  );
};

const DetailItem = ({ label, value, extraStyling = "" }) => (
  <div className={`flex flex-col p-4 `}>
    <span className="font-bold text-gray-600">{label}</span>
    <span className="text-sm text-gray-600">{value}</span>
  </div>
);


