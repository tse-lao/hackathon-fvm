
import LoadingFull from '@/components/application/elements/loading/LoadingFull';
import LoadingIcon from '@/components/application/elements/loading/LoadingIcon';
import AccessDenied from '@/components/application/elements/message/AccessDenied';
import FileDetailInformation from '@/components/application/files/FileDetailInformation';
import FileSharedWith from '@/components/application/files/FileSharedWith';
import CreateDeal from '@/components/marketplace/CreateDeal';
import { downloadCid, readJWT } from '@/hooks/useLighthouse';
import { readBlobAsJson, readTextAsJson } from '@/lib/dataHelper';
import Layout from '@/pages/Layout';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import lighthouse from '@lighthouse-web3/sdk';
import { useDocument, usePolybase } from '@polybase/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';



const fileDefault = {
    "fileSizeInBytes": "",
    "cid": "",
    "encryption": false,
    "fileName": "",
    "mimeType": "",
    "txHash": ""
}

// Declare mimeType as constants
const MIMETYPE_IMAGE_JPEG = "image/jpeg";
const MIMETYPE_IMAGE_PNG = "image/png";
const MIMETYPE_APP_JSON = "application/json";
const MIMETYPE_TEXT_PLAIN = "text/plain";
const MIMETYPE_APP_CSV = "application/csv";

export default function ViewFile() {
    const { cid } = useRouter().query;
    const { address } = useAccount();
    const [fileInfo, setFileInfo] = useState(fileDefault);
    const [fileURL, setFileURL] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fileContent, setFileContent] = useState(null);
    const [accessDenied, setAccessDenied] = useState(false);
    const polybase = usePolybase();
    const [createCarDeal, setCreateCarDeal] = useState(false);

    const { data } = useDocument(polybase.collection("File").where("cid", "==", cid));


    //get the file info.
    useEffect(() => {
        const getFile = async () => {
            const status = await lighthouse.getFileInfo(cid)
            setFileInfo(status.data);

            if (!status.data.encryption) {
                const file = cid.toString();
                readContent(status.data.mimeType, file);
                setFileContent(file)
                
            }


            await decrypt(status.data.mimeType);
            if (data.data.length > 0) {
                console.log(data);
                const deal = await fetch(`/api/tableland/request?cid=${data.data[0].data.carPayload}`)
                const dealData = await deal.json();
                console.log(dealData);
            }

            setLoading(false)
        }

        if (cid && data) { getFile() }

    }, [cid, data])

    /* Decrypt file */
    const decrypt = async (mimeType) => {
        const jwt = await readJWT(address);
        try {
            const keyObject = await lighthouse.fetchEncryptionKey(
                cid,
                address,
                jwt
            );

            const decrypted = await lighthouse.decryptFile(cid, keyObject.data.key);
            readContent(mimeType, decrypted);

        } catch (e) {
            console.log(e);
            setAccessDenied(true);
        }
        //setFileData(decrypted);
    }


    async function readContent(fileType, content) {
        console.log(fileType);

        if (fileType === MIMETYPE_APP_JSON) {
            await readBlobAsJson(content).then((json) => {
                setFileURL(json)
            });
            return;
        }

        if (fileType === MIMETYPE_TEXT_PLAIN) {
            await readTextAsJson(content, (error, json) => {
                if (error) {
                    toast.error('Failed to read the Blob as JSON:', error);
                } else {

                    setFileURL(json)
                }
            });
            
            return;

        }
        if (fileType === MIMETYPE_APP_CSV) {
            await readBlobAsJson(content).then((json) => {
                setFileURL(json)
            });
            return;
        }
        if (fileType === MIMETYPE_IMAGE_PNG) {
            const url = URL.createObjectURL(content);
            setFileURL(url);
            return;
        }        
        if (fileType === MIMETYPE_IMAGE_JPEG) {
            const url = URL.createObjectURL(content);
            setFileURL(url);
            return;
        }


    }

    //TODO: need to fix the download function for the file. 
    function download() {
        // Create an anchor element with the download attribute
        const link = document.createElement('a');
        link.href = URL.createObjectURL(fileURL);
        link.download = "filename";

        // Trigger the download by simulating a click event
        document.body.appendChild(link);
        link.click();

        // Clean up the DOM by removing the temporary anchor element
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        }, 0);
    }

    const closedDeal = () => {
        setCreateCarDeal(false);
        //check if what network the user is onn.. 

    }

    if (loading) return <LoadingFull />

    return (
        <Layout>

            {createCarDeal && <CreateDeal cid={cid} onClose={closedDeal} />}
            <div>
                <div className="flex justify-between sm:flex sm:items-center mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{fileInfo.fileName}</h1>
                    </div>
                    
                </div>

                <div className="flex flex-col md:flex-row mt-4 space-y-4 md:space-y-0 md:space-x-4">
                    {/* File content */}
                    <div className="flex-grow p-4 bg-white shadow-sm rounded-lg mr-4 border w-full overflow-scroll">
                    
                        {loading ? <LoadingIcon height={100} width={100} />
                            : (
                                accessDenied ? <AccessDenied message="No Acces to this File" /> :
                                    (
                                        <div className="prose prose-sm max-w-none max-h-[600px] overflow-auto">
                                            {fileInfo.mimeType == "image/jpeg" && <img src={fileURL} />}
                                            <DocViewer
                                            documents={{
                                              uri: fileURL,
                                              fileName: fileInfo.name,
                                            }}
                                            pluginRenderers={DocViewerRenderers}
                                          />

                                            {fileInfo.mimeType == "image/png" && <img src={fileURL} />}
                                            {fileInfo.mimeType == "application/json" && <pre>{JSON.stringify(fileURL, null, 2)}</pre>}
                                            {fileInfo.mimeType == "text/plain" && <pre>{JSON.stringify(fileURL, null, 2)}</pre>}
                                        </div>

                                    ))}
                    </div>

                    {/* Sidebar */}

                    <div className="w-120 p-4 w-[350px] bg-white shadow-sm rounded-lg flex flex-col gap-8 h-full">
                    <div className="space-x-4">
                        <button
                            onClick={() => setCreateCarDeal(!createCarDeal)}
                            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Create Deal
                        </button>
                        <button
                            onClick={() => downloadCid(cid, address, fileInfo.fileName)}
                            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Download
                        </button>
                    </div>
                        <FileDetailInformation detail={fileInfo} className="mt-4 mb-4" cid={cid} address={address} />
                        <FileSharedWith detail={fileInfo} cid={cid} />
                    </div>
                </div>
            </div>
        </Layout>

    )
}
