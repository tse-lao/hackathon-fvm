import StravaActivity from "@/components/application/connections/StravaActivity";
import { ActionButton } from "@/components/application/elements/buttons/ActionButton";
import { OpenButton } from "@/components/application/elements/buttons/OpenButton";
import LoadingIcon from "@/components/application/elements/loading/LoadingIcon";
import DataNotFound from "@/components/application/elements/message/DataNotFound";
import MatchRecord from "@/hooks/useBlockchain";
import { fetchWithRetry, getLighthouse, readJWT, uploadCarFile } from "@/hooks/useLighthouse";
import { analyzeJSONStructure, getMetadataCID } from "@/lib/dataHelper";
import lighthouse from '@lighthouse-web3/sdk';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import Layout from "../Layout";

export default function Strava() {
    const name = "Strava"
    const router = useRouter();
    const { address } = useAccount();
    const [apiConnected, setApiConnected] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [stravaData, setStravaData] = useState({});
    const [activities, setActivities] = useState([]);
    const [uploadingStatus, setUploadingStatus] = useState(false);
    const [loadingExport, setLoadingExport] = useState(false);
    const { token } = router.query;


    useEffect(() => {
        if (token) {
            localStorage.setItem('stravaToken', token);
            setApiConnected(true);
        }

        const stravaToken = localStorage.getItem('stravaToken');
        if (stravaToken) {
            setApiConnected(true);
            setAccessToken(stravaToken);
            const id = localStorage.getItem('strava_userID');
            if (id) {
                setStravaData({ id: id });
            }
        }

    }, [token]);



    const authStrava = () => { window.location.href = '/api/auth/strava'; }

    const getProfile = async () => {
        const response = await fetch('https://www.strava.com/api/v3/athlete', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        const data = await response.json();

        localStorage.setItem('strava_userID', data.id);
        setStravaData(data);
    }

    const getActivities = async () => {
        const id = stravaData.id;
        const response = await fetch(`https://www.strava.com/api/v3/athlete/activities`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });


        console.log(response)
        const data = await response.json();
        console.log(data);
        if (data.errors) {
            toast.error(data.message);
            return;
        }
        console.log(data);
        setActivities(data);
    }

    const exportActivities = async () => {

        setLoadingExport(true);
        toast.success('Exporting activities...');
        setUploadingStatus('Converting JSON to file');

        //take the blob of the json and turn it into a file. 
        let jsonBlob = new Blob([JSON.stringify(activities)], { type: "application/json" });
        //now we have blob where we can get the metadata from .
        console.log(jsonBlob)
        setUploadingStatus('Getting metadata from file');
        const analyze = await analyzeJSONStructure(activities);
        const metadata = await getMetadataCID(JSON.stringify(analyze));
        console.log(metadata);

        const file = new File([jsonBlob], "strava.json", { type: "application/json" });

        setUploadingStatus('Get accesstoken to lighthouse');
        const apiKey = await getLighthouse(address);
        const jwt = await readJWT(address)

        const mockEvent = {
            target: {
                files: [file],
            },
            persist: () => { },
        };


        setUploadingStatus('Uploading encrypted file to lighthouse');
        const response = await lighthouse.uploadEncrypted(
            mockEvent,
            apiKey,
            address,
            jwt
        )


        //from ehere we need to call the function of ]

    let dataDepo = []   
            let cid = response.data.Hash;

            let endpoint = `https://gateway.lighthouse.storage/ipfs/${cid}`;
            let blob = await fetchWithRetry(endpoint, 1000, 5);

            let  newFile = new File([blob], cid, { type: "application/json" });
            dataDepo.push(newFile)
        
        console.log(dataDepo)



        setUploadingStatus("Getting access control for data depo.");

        const authToken = await lighthouse.dataDepotAuth(apiKey);
        console.log(authToken.data.access_token)

        setUploadingStatus("Storing files in data depo.");
        const result = await uploadCarFile(dataDepo, progressCallback, authToken.data.access_token);
        console.log(result)
        await sleep(1000);
        setUploadingStatus("Matching files and storing both files in Polybase.");
        await MatchRecord([file], authToken.data.access_token)

        toast.success('Activities exported successfully');
        
        setUploadingStatus(false)
        router.push(`/files/${cid}`);

    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const progressCallback = (progress) => {
        console.log(progress)
    }


    return (

        <Layout active="Connections">
            <main className="min-h-screen py-6 flex flex-col  sm:py-12">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center">

                            <h1 className="text-2xl font-semibold text-gray-900 ">{name} </h1>
                        </div>
                        <button
                            onClick={() => router.back()}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            Go Back
                        </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                            <h2 className="text-lg font-medium mb-2 text-gray-700">Connected Profile</h2>
                            {!apiConnected ? (
                                <div>
                                    <OpenButton onClick={authStrava} text="Connect your Strava Account" />
                                </div>
                            ) : (
                                <ActionButton onClick={getProfile} text="Get Profile" />
                            )}
                            {
                                Object.keys(stravaData).map((key, index) => (
                                    <div key={index}>
                                        <p className="text-gray-600">{key}: {stravaData[key]}</p>
                                    </div>
                                ))}


                        </div>
                        {/* Right column: tweets, ads preferences, data profiles */}
                        <div className="space-y-4">
                            <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 ">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-medium text-gray-700">Activities [{activities.length}]</h2>
                                    <div>

                                        <button
                                            className="py-1 px-3 bg-cf-500 text-white rounded-md"
                                            onClick={exportActivities}
                                        >
                                            Export
                                        </button>
                                    </div>
                                </div>
                                {loadingExport ? (
                                    <div className="overflow-auto h-96 flex flex-col gap-6">
                                        <div className="flex justify-center text-center flex-col gap-6 py-6">
                                            <LoadingIcon height={64} />
                                            <span className='text-lg font-md text-gray-500'>
                                                {uploadingStatus}
                                            </span>

                                        </div>
                                    </div>
                                ) : (

                                    <div className="overflow-auto h-96">
                                        {activities && activities.length > 0 ? (
                                            activities.map((activity) => (
                                                <StravaActivity key={activity.id} activity={activity} />
                                            ))
                                        ) : (
                                            <div>
                                                <DataNotFound message="Please load your activities" />
                                                <OpenButton onClick={getActivities} text="Get Activities" />
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                            <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                                <h2 className="text-lg font-medium mb-2 text-gray-700">Ads Preferences</h2>
                                <ul className="list-disc list-inside text-gray-600">
                                    <DataNotFound message="Not yet implemented" />
                                </ul>
                            </div>
                            <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                                <h2 className="text-lg font-medium mb-2 text-gray-700">Data Profiles</h2>
                                <ul className="list-disc list-inside text-gray-600">
                                    <DataNotFound message="Not yet implemented" />
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>


    );
}
