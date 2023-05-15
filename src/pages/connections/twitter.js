import Connected from "@/components/application/elements/Connected";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../Layout";

export default function TwitterDetails() {
    const name = "Twitter"
    const  router  = useRouter();
    const [apiConnected, setApiConnected] = useState(false);
    const [manualConnected, setManualConnected] = useState(false);

    // For now, I'll use some dummy data
    const profile = {
        name: 'John Doe',
        handle: '@johndoe',
        bio: 'Just a regular guy.',
        location: 'San Francisco, CA',
        joined: new Date(),
    };

    const tweets = [
        {
            id: 1,
            text: 'Hello, world!',
            createdAt: new Date(),
        },
        {
            id: 2,
            text: 'My second tweet.',
            createdAt: new Date(),
        },
        // ... more tweets
    ];

    const adsPreferences = ['Technology', 'Sports', 'Music'];

    const dataProfiles = ['Profile 1', 'Profile 2'];
    
    
    const connectTwitter = async () => {
        console.log("connect twitter")
        try {
            // Send a request to your server to start the OAuth flow.
            // Replace this URL with your own API endpoint.
            const res = await fetch('/api/socials/connect-twitter');
            const data = await res.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Redirect the user to the Twitter authorization screen.
            window.location.href = data.authorizeUrl;
        } catch (error) {
            console.error('Failed to connect to Twitter:', error);
        }
    };

    return (

            <Layout active="Connections">
                <main className="min-h-screen py-6 flex flex-col  sm:py-12">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-semibold text-gray-900">{name}</h1>
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
                                <h2 className="text-lg font-medium mb-2 text-gray-700">{profile.name}</h2>
                                <p className="text-gray-600">{profile.handle}</p>
                                <p className="text-sm text-gray-400">{profile.bio}</p>
                                <p className="text-sm text-gray-400">Location: {profile.location}</p>
                                <p className="text-sm text-gray-400">Joined: {profile.joined.toDateString()}</p>
                                
                                <h2 className="text-md  mt-5 font-medium mb-2 text-gray-700">Data Collection Methods</h2>
                                <ul>
                                    <li className="flex items-center mb-2">
                                                <Connected handleConnect={connectTwitter} connected={apiConnected} msg="API connection"/>
                                    </li>
                                    <li className="flex items-center mb-2">
                                            <Connected connected={manualConnected} msg="manual"/>
                                    </li>
                                    {/* ...other methods */}
                                </ul>
                            </div>
                            {/* Right column: tweets, ads preferences, data profiles */}
                            <div className="space-y-4">
                                <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                                    <h2 className="text-lg font-medium mb-2 text-gray-700">Tweets</h2>
                                    {tweets.map((tweet) => (
                                        <div key={tweet.id}>
                                            <p className="text-gray-600">{tweet.text}</p>
                                            <p className="text-sm text-gray-400">{tweet.createdAt.toDateString()}</p>
                                        </div>
                                    ))}
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
