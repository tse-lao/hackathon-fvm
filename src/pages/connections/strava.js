import StravaActivity from "@/components/application/connections/StravaActivity";
import Connected from "@/components/application/elements/Connected";
import { getLighthouse, readJWT, uploadCarFileFromCid } from "@/hooks/useLighthouse";
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
    const {address} = useAccount();
    const [apiConnected, setApiConnected] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [stravaData, setStravaData] = useState({});
    const [activities, setActivities] = useState([]);
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

    const adsPreferences = ['Technology', 'Sports', 'Music'];

    const dataProfiles = ['Profile 1', 'Profile 2'];

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
        toast.success('Exporting activities...');
        
        //take the blob of the json and turn it into a file. 
        let jsonBlob = new Blob([JSON.stringify(activities)], { type: "application/json" });
        //now we have blob where we can get the metadata from .
        const analyze = await analyzeJSONStructure(activities);
        const metadata = await getMetadataCID(JSON.stringify(analyze));
        console.log(metadata);
        
        const file = new File([jsonBlob], "strava.json", { type: "application/json" });
        const apiKey = await getLighthouse(address);
        const jwt = await readJWT(address)
        const mockEvent = {
            target: {
                files: [file],
            },
            persist: () => { },
        };
        
        const response = await lighthouse.uploadEncrypted(
            mockEvent,
            apiKey, 
            address, 
            jwt
        )
        
        //from ehere we need to call the function of ]

        
        const result = await uploadCarFileFromCid(response.data.Hash, address, metadata); 
        
        console.log(result);
        
    }


    return (

        <Layout active="Connections">
            <main className="min-h-screen py-6 flex flex-col  sm:py-12">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center">
                            <Connected handleConnect={authStrava} connected={apiConnected} />
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
                        {/* Left column: profile */}
                        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                            <h2 className="text-lg font-medium mb-2 text-gray-700">Strava Profile</h2>
                            <button
                                onClick={getProfile}

                            >
                                Get Profile
                            </button>

                            {Object.keys(stravaData).map((key, index) => (
                                <div key={index}>
                                    <p className="text-gray-600">{key}: {stravaData[key]}</p>
                                </div>
                            ))}
                        </div>
                        {/* Right column: tweets, ads preferences, data profiles */}
                        <div className="space-y-4">
                            <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 ">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-medium text-gray-700">Activities</h2>
                                    <div>
                                        <button
                                            className="mr-2 py-1 px-3 bg-blue-500 text-white rounded-md"
                                            onClick={getActivities}
                                        >
                                            Load Data
                                        </button>
                                        <button
                                            className="py-1 px-3 bg-green-500 text-white rounded-md"
                                            onClick={exportActivities}
                                        >
                                            Export Data
                                        </button>
                                    </div>
                                </div>
                                <div className="overflow-auto h-96">
                                {activities && activities.length > 0 ? (
                                    activities.map((activity) => (
                                        <StravaActivity key={activity.id} activity={activity} />
                                    ))
                                ) : (
                                    <p className="text-gray-600">No data available. Please load the data.</p>
                                )}
                                </div>
                            </div>
                            <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                                <h2 className="text-lg font-medium mb-2 text-gray-700">Ads Preferences</h2>
                                <ul className="list-disc list-inside text-gray-600">
                                    {adsPreferences.map((pref, index) => (
                                        <li key={index}>{pref}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                                <h2 className="text-lg font-medium mb-2 text-gray-700">Data Profiles</h2>
                                <ul className="list-disc list-inside text-gray-600">
                                    {dataProfiles.map((profile, index) => (
                                        <li key={index}>{profile}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>


    );
}
