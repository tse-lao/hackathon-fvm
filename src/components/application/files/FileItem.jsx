// components/FileItem.js

import { formatBytes } from '@/lib/helpers';
import { FolderIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import FileDetail from './FileDetail';

export default function FileItem  ({ file }) {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <div
        key={file.id}
        className="bg-white flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded-lg p-2"
        onClick={handleClick}
      >
        <div className="flex items-center">
          <span className="mr-4">
            {file.mimeType === null ? (
              <FolderIcon className="fas fa-folder text-yellow-500" />
            ) : (
              <PhotoIcon className="fas fa-file text-blue-500" />
            )}
          </span>
          {file.encryption ? (
            <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                <circle cx={4} cy={4} r={3} />
            </svg>

        ) : (
            <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-red-400" fill="currentColor" viewBox="0 0 8 8">
                <circle cx={4} cy={4} r={3} />
            </svg>
        )}
          <span className="text-gray-700">{file.fileName}</span>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-600">{formatBytes(file.fileSizeInBytes)}</span>
        </div>
      </div>
      {showModal && <FileDetail file={file} changeModalState={handleCloseModal} />}
    </>
  );
};


