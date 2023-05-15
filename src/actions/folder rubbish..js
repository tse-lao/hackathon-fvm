import { usePolybase } from "@polybase/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
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

        const categories = ["Facebook", "Profile", "Data"];
        // Iterate through the uploaded files
        for (const file of uploadedFiles) {

            const { name, size, type, lastModifiedDate, webkitRelativePath, content } = file;

            // Get the directory from the webkitRelativePath
            const directories = webkitRelativePath.split('/');

            directories.pop();

            let parentFolder = null;

            for (let i = 0; i < directories.length; i++) {
                categories.push = directories[i];   
            }
        
             
        

                if (i > 0) {
                    //first we check if the parent exit 
                    const parentResult = await polybase.collection("Folder").where("name", "==", directories[i - 1]).where("owner", "==", address).get();


                    if (parentResult.data.length > 0) {

                        parentFolder = parentResult.data[0].data;

                        if (parentFolder.subFolder.length > 0) {
                            const pId = parentFolder.id;
                            try {
                                const folder = await polybase.collection("Folder").where("owner", "==", address).where("name", "==", directory).where("parent", "==", pId).get();
                                addFile(file, folder.id);
                            } catch (e) {
                                //no record found for a parent. 
                                console.log(e)
                                const folder = await createFolder(directory, parentFolder.id)
                                addFile(file, folder.id);
                            }
                        }
                        //now we want to check if this exist.
                        else {
                            const folder = await createFolder(directory, parentFolder.id);
                            addFile(file, folder.id);

                        }
                    }

                }

                if (i === 0) {
                    const { data: newFolder } = await polybase.collection("Folder").where("name", "==", directory).where("owner", "==", address).get();
                    console.log(newFolder)
                    addFile(file, newFolder.id)
                    if (newFolder.length < 1) {
                    }
                }
            }

            //const getFolder = await polybase.collection("Folder").where("name", "==", directory).where("owner", "==", address).get();
            //console.log(getFolder)


            ///createFolder(directory, 



            /*      if (!folder) {
                   folder = new Folder({ name: directory });
                   await folder.save();
                 }
                 
                 
                       // Create a new File instance and associate it with the folder
                 const newFile = new File({
                   name,
                   size,
                   type,
                   lastModifiedDate,
                   content,
                   folder: folder._id,
                 });
             
                 // Save the new File instance to the database
                 await newFile.save();
             
                 // Update the folder to include the new file
                 folder.files.push(newFile);
                 await folder.save(); */
        }
    }

    async function createFolder(name, parent) {
        const updatedAt = new Date().toISOString();
        const newId = uuidv4();

        console.log("==== !!! Creating new folder...")
        //double check if it already exist 
        try {
            const { data: findFolder } = await polybase.collection("Folder").where("owner", "==", address).where("name", "==", name).where("parent", "==", parent).get();
            console.log(findFolder);
            if (findFolder.length > 0) {
                console.log(findFolder[0].data)
                return findFolder[0].data;
            }

        } catch (e) {

            console.log(e);
            const { data: result } = await polybase.collection("Folder").create([
                newId,
                name,
                address,
                updatedAt,
                parent
            ])

            console.log(result);

            return result;
        }




        const collection = await polybase.collection("Folder").create([
            newId,
            name,
            address,
            updatedAt,
            parent
        ])

        if(parent != ""){
            const updateParent = await polybase.collection("Folder").record(collect.data.id)
            .call("addFolder", [await polybase.collection("Folder").record(newFolder.id)])

        }
        
        return collection.data;
    }
    
    async function addFile(file, parent) {
        console.log(file, parent);
        //add the path in here aswel, and potentially in the future add the parent folder. 
      
        const { name, size, type, lastModifiedDate, webkitRelativePath, content } = file;
        const uploaddedAt = new Date().toISOString();
        const newId = uuidv4();
        
        //get the metadata of the file. 
        //get the cid of the file. 
        const randomRID = uuidv4();
        
        const { result } = await polybase.collection("File").create([
            newId,
            name,
            size,
            type,
            lastModifiedDate,
            uploaddedAt,
            randomRID,
            address,
            parent
        ])
        
        console.log(data);
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
                                <input type="file" multiple directory="" webkitdirectory="" onChange={handleFileChange} />
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
