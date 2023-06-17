import { usePolybase } from "@polybase/react";
import { ethers } from "ethers";
import { useState } from "react";
import InputField from "../application/elements/input/InputField";

export default function SearchMember({ addMember }) {
    const db = usePolybase();
    const [valid, setValid] = useState(true);
    const [message, setMessage] = useState("Please enter a valid address to be added");

    async function getUsername(searchInput) {
        const records = await db.collection("Profile").where("name", "==", searchInput).get();


        if (records.data === null) {
            const { data, cursor } = records;
            console.log(data);
            console.log(data[0].data.id);
            console.log(ethers.utils.computeAddress());
        }

        //check if its a valid address
        if (ethers.utils.isAddress(searchInput)) {
            addMember(searchInput);
            setValid(true);
            setMessage(`Please fill out the form to add ${searchInput} to the multisig`)
            return;
        }

        setMessage("This is not a valid address")
        setValid(false);


    }

    return (
        <div>
            <div className="w-[400px] text-sm">
                <InputField
                    type="text"
                    placeholder="Enter address to add new member"
                    name="search"
                    id="search"
                    className="outline outline-cf-500 w-fit"
                    onEnter={getUsername}
                />
            </div>

            {message && <span className={`${valid ? 'text-cf-500' : 'text-red-500'}`}>{message}</span>}

        </div>


    )
}
