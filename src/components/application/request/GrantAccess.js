import { data_contribution } from "@/constants";
import { useContract } from "@/hooks/useContract";
import { countRows, shareFile } from "@/hooks/useLighthouse";
import { validateInput } from "@/hooks/useLitProtocol";
import { useDocument, usePolybase } from "@polybase/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingSpinner from "../elements/LoadingSpinner";
import LoadingIcon from "../elements/loading/LoadingIcon";
import DataNotFound from "../elements/message/DataNotFound";
const PROVIDE_ACCESS = "Please confirm and sign your data to provide access to the contract";
const VALIDATE_VALUE = "We are confirming if the provided data is corresponding the dataformat of the dataset. ";
const RECORD_CONTRIBUTION = "Confirm your contribution to the contract, the owner is only able to see decrypt you data if a certain amount of contributions are made";
const COUNTING_ROWS = "We are counting the rows of the dataset, this might take a while depending on the size of the dataset";

export default function GrantAccess({ tokenID, metadataCID, address, creator, minRows, multiSig }) {
  const polybase = usePolybase();
  const { data, error, loading } = useDocument(polybase.collection("File").where("metadata", "==", metadataCID).where("owner", "==", address.toLowerCase()));
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [counter, setCoutner] = useState(0);
  const { submitData } = useContract();

  const [status, setStatus] = useState("active");

  useEffect(() => {
    if (data) {
      //fetch all the contirbutions of this address. 
      const fetchData = async () => {
        const result = await fetch(`/api/tableland/contributions?${data_contribution}.tokenID=${tokenID}&${data_contribution}.creator=${address.toLowerCase()}`);
        const status = await result.json();
        console.log(status.result)
        if(status.result.length > 0){
          //we want only the dataCID in options
          const dataCID = status.result.map((item) => item.dataCID);
          setOptions(dataCID)
          return;
        }
       // setSelectedOptions(status.result)
      }
      
      //check whether the account is in the multisig table 
      
      
      
      fetchData();
    }
  }, [data]);
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
    if (selectedOptions.length == 0) {
      toast.error("Error: By not providing the rights inputs")
      return;
    };


    for (let i = 0; i < selectedOptions.length; i++) {
      setCoutner(i+1)
      setStatus(PROVIDE_ACCESS)
      const cid = selectedOptions[i];
       
      await shareFile(cid, creator, address, tokenID);

      

      if (tokenID < 1 && selectedOptions.length == 1) {
        toast.error("Error: By not providing the rights inputs")
      }
      
      setStatus(COUNTING_ROWS);
      const count = await countRows(cid, address);
      
      if(count < minRows){
        toast.error("Error: This CID does not contain enough rows to be used for training the model");
        break;
      }
      

      setStatus(VALIDATE_VALUE)
      const getData = await validateInput(tokenID, selectedOptions[i], count);

      setStatus(RECORD_CONTRIBUTION)
      
      toast.promise(submitData(tokenID, selectedOptions[i], count.toString(),  getData.v, getData.r, getData.s), {
        pending: "Waiting for transaction to confirm 🕐",
        success: "Successfully contributing to the dataset. Thank you for your support.  👌",
        error: "Something went wrong, please try again.. 🤯",
      }).then(
        (val) => {
          window.location.reload();
        }
      )
     
    }
    setStatus("active")

  }
  
  if (loading) return <LoadingSpinner msg="loading files" />
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="ax-w-lg mx-auto">
      <h2 className="text-gray-700 text-lg font-semibold mb-2">Contribute</h2>
      <span
        className="text-gray-600 italic text-xs mb-4 block"
      >
        Below you can contribute to the project by providing access to your data. You can select multiple data sets to provide access to.
        The more contributions you make the more you will be rewarded. If you cannot unselect an item than it is already submitted to the array
      </span>
      {status == "active" ? (
        <div>
          <div className="divide-y divide-gray-200 max-h-[400px] overflow-auto outline outline-cf-300 rounded-md ring-cf-200">
            {data.data.length > 0 ? data.data.map((item, index) => (
              
              <label key={index} className={`flex items-center py-4 px-4 hover:bg-gray-100 transition-colors duration-150 cursor-pointer ${options.includes(item.data.cid) && 'bg-cf-200 hover:none'} `}>
                <input
                  type="checkbox"
                  value={item.data.cid}
                  checked={selectedOptions.includes(item.data.cid) || options.includes(item.data.cid)}
                  onChange={handleCheckboxChange}
                  disabled={options.includes(item.data.cid)}
                  className="form-checkbox text-cf-500 rounded-sm"
                />
                <span className="ml-4 text-gray-600 text-md overflow-hidden overflow-ellipsis whitespace-nowrap max-w-full">{item.data.name}  </span>
              </label>
            )) : (
              <DataNotFound message="No files with this metadata" />
            )}

          </div>
          <button
            className="mt-4 w-full bg-cf-500 text-white rounded-md px-4 py-2 text-sm font-semibold shadow-sm hover:bg-cf-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
            onClick={provideAccess}
            disabled={selectedOptions.length == 0}
          >
            Contribute [{selectedOptions.length}]
          </button>
        </div>
      ) : (
        <div>
          <div className="flex flex-col text-center py-8 justify-center items-center">
            <LoadingIcon height={128}  /> <br />
            <p className="text-gray-500 text-xl  font-medium">

              {status}

            </p>
            <span>
              {counter} / {selectedOptions.length}
            </span>
          </div>
        </div>
      )}
    </div>


  )
}
