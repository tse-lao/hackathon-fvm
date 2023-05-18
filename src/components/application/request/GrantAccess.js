import { useContract } from "@/hooks/useContract";
import { shareFile } from "@/hooks/useLighthouse";
import { validateInput } from "@/hooks/useLitProtocol";
import { useDocument, usePolybase } from "@polybase/react";
import { useState } from "react";
import { toast } from "react-toastify";
import LoadingSpinner from "../elements/LoadingSpinner";

export default function GrantAccess({ tokenID, metadataCID, address, creator }) {
  const polybase = usePolybase();

  const { data, error, loading } = useDocument(polybase.collection("File").where("metadata", "==", metadataCID).where("owner", "==", address));

  const [selectedOptions, setSelectedOptions] = useState([]);
  const { submitData } = useContract();

  if (loading) return <LoadingSpinner msg="loading files" />
  if (error) return <div>Error: {error.message}</div>

  const handleCheckboxChange = (e) => {
    const checkedValue = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setSelectedOptions((prevSelectedOptions) => [...prevSelectedOptions, checkedValue]);
    } else {
      setSelectedOptions((prevSelectedOptions) =>
        prevSelectedOptions.filter((option) => option !== checkedValue)
      );
    }
  };

  const provideAccess = async () => {
    //call lighthouse function to provide access based on the porject statistics. 
    const cid = selectedOptions[0];

    //for testing recover address only
    //await recoverAddress(cid);

    //const result = await grantSmartAccess(cid, tokenID, "10001");
    //console.log(result)

    //const litProtocol = await runLitProtocol(cid);
    // console.log(litProtocol)

    const response = await shareFile(cid, creator);
    console.log(response)

    if (tokenID < 1 && selectedOptions.length == 1) {
      toast.error("Error: By not providing the rights inputs")
    }

    const getData = await validateInput(tokenID, selectedOptions[0], 10000);
    console.log(getData)

    console.log(getData.v)
    try {
      await submitData(tokenID, selectedOptions[0], "10000", getData.v, getData.r, getData.s);
      toast.success("Access granted!")
      //also want toa dd to db            
    } catch (e) {
      console.log(e)
      toast.error(e.message)
    }
  }


  return (
    <div className="ax-w-lg mx-auto">
      <h2 className="text-gray-700 text-lg font-semibold mb-4">Grant Access</h2>
      <div className="divide-y divide-gray-200 max-h-[400px] overflow-auto">
        {data.data ? data.data.map((item, index) => (
          <label key={index} className="flex items-center py-4 hover:bg-gray-100 transition-colors duration-150 cursor-pointer">
            <input
              type="checkbox"
              value={item.data.cid}
              checked={selectedOptions.includes(item.data.cid)}
              onChange={handleCheckboxChange}
              className="form-checkbox text-cf-500 rounded-sm"
            />
            <span className="ml-2 text-gray-600 text-sm overflow-hidden overflow-ellipsis whitespace-nowrap max-w-full">{item.data.name}</span>
          </label>
        )) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-xl font-medium">No data available</p>
            <p className="text-gray-400 text-md">Please add some data.</p>
          </div>
        )}
      
      </div>
      <button
      className="mt-4 w-full bg-indigo-500 text-white rounded-md px-4 py-2 text-sm font-semibold shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
      onClick={provideAccess}
    >
      Provide Access
    </button>
    </div>


  )
}
