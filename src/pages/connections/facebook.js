import { readJWT } from "@/hooks/useLighthouse";
import { getLighthouse } from "@/lib/createLighthouseApi";
import { getMetadataFromFile } from "@/lib/dataHelper";
import lighthouse from "@lighthouse-web3/sdk";
import { usePolybase } from "@polybase/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import Layout from "../Layout";


export default function FacebookDetails() {
    const name = "Facebook"
    const router = useRouter();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const { address } = useAccount();
    const polybase = usePolybase();




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



    const handleFileChange = (event) => {
        const fileList = Array.from(event.target.files);
        setSelectedFiles(fileList);

        console.log(fileList)
    };

    const handleUpload = () => {
        // Implement upload logic here
        if (selectedFiles.length > 0) {
            // Perform further processing with the selected files
            console.log('Selected files:', selectedFiles);
            processUploadedFiles(selectedFiles);


        } else {
            console.log('No files selected.');
        }
    };

    async function processUploadedFiles(uploadedFiles) {
        const jsonToken = await readJWT(address);
        const api = await getLighthouse(address);


        // Iterate through the uploaded files
        for (const file of uploadedFiles) {
            const categories = ["Facebook", "Data"];

            const { name, size, type, lastModifiedDate, webkitRelativePath, content } = file;

            if (name != ".DS_Store") {


                // Get the directory from the webkitRelativePath
                const directories = webkitRelativePath.split('/');

                directories.pop();

                for (let i = 0; i < directories.length; i++) {
                    categories.push(directories[i]);
                }

               const fileCID = await uploadToLighthouse(file, jsonToken, api);

            
               let metadata = "no-json"
                if (type == "application/json") {
                    
                    metadata = await getMetadataFromFile(file);
                   
                }

                try {
                    const res = await uploadToPolybase(address, categories, metadata, fileCID, name)
                    toast.success("Successfully uploaded your data to Polybase!");
                }catch(e){
                    toast.error(e.message)
                }
                
                

               
            }
        }
    }
    
    async function uploadToPolybase(address, categories, metadata, cid, name) {
        const url = "http://localhost:4000"

        const query = `
        mutation Mutation($owner: String!, $categories: [String], $metadata: String, $cid: String, $fileName: String) {
            uploadFileToPolybase(owner: $owner, categories: $categories, metadata: $metadata, cid: $cid, fileName: $fileName)
          }
        `

        //call the function to upload it to polybase in the backend. 
        const upload = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: {
                    owner: address,
                    categories: categories,
                    metadata: metadata,
                    cid: cid,
                    fileName: name
                },
            })
        });
        
        const result= await upload.json();

        console.log(result)
    }

    async function uploadToLighthouse(file, jsonToken, api) {
        const mockEvent = {
            target: {
                files: [file],
            },
            persist: () => { },
        };

        //now now what we want to do it create json web token and then sign all the data and collect the metadata. 
        const uploadedFile = await lighthouse.uploadEncrypted(mockEvent, api, address, jsonToken)

        return uploadedFile.data.Hash;
    }


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
                            <div>
                                <input type="file" multiple  webkitdirectory="" onChange={handleFileChange} />
                                <button onClick={handleUpload}>Upload</button>


                            </div>
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
