import lighthouse from '@lighthouse-web3/sdk';
import { useEffect, useState } from "react";
import UploadModal from "../../UploadModal";
import FileItem from './FileItem';


export default function FileList({ address }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [files, setFiles] = useState([])
    const [totalFiles, setTotalFiles] = useState(0)



    useEffect(() => {
        
        
        const getFiles = async () => {

            console.log(address)
            const uploads = await lighthouse.getUploads(address);
            setFiles(uploads.data.fileList)
            setTotalFiles(uploads.data.totalFiles)

            /*    data: {
                   fileList: [
                     {
                       publicKey: '0xa3c960b3ba29367ecbcaf1430452c6cd7516f588',
                       fileName: 'flow1.png',
                       mimeType: 'image/png',
                       txHash: '0x7c9ee1585be6b85bef471a27535fb4b8d7551340152c36c025743c36fd0d1acc',
                       status: 'testnet',
                       createdAt: 1662880331683,
                       fileSizeInBytes: '31735',
                       cid: 'QmZvWp5Xdyi7z5QqGdXZP63QCBNoNvjupF1BohDULQcicA',
                       id: 'aaab8053-0f1e-4482-9f84-d413fad14266',
                       lastUpdate: 1662883207149,
                       encryption: true
                     },  
                   ],
                   totalFiles: 1 */
        }
        getFiles()

    }, [])

    const openModal = () => {
        setIsModalOpen(!isModalOpen)
    }
    const closeModal = () => {
        setIsModalOpen(false)
    }
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Files</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Below find all the files uploaded by you.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        onClick={openModal}
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Add file
                    </button>
                </div>
            </div>
            <div className="mt-4 sm:flex sm:items-center">
                {isModalOpen && <UploadModal onClose={closeModal} />}
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <div className="min-w-full divide-y divide-gray-300">
                                {totalFiles > 0 ?
                                    files.map((item) =>
                                        <FileItem file={item} key={item.id} />
                                    ) : (

                                        <div className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            No files found
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

