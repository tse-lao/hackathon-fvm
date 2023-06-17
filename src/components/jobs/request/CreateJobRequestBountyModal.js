import { ActionButton } from '@/components/application/elements/buttons/ActionButton'
import InputField from '@/components/application/elements/input/InputField'
import SelectMultiSig from '@/components/application/elements/input/SelectMultiSig'
import TextArea from '@/components/application/elements/input/TextArea'
import { useContract } from '@/hooks/useContract'
import { useState } from 'react'
import TagsInput from 'react-tagsinput'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'

//TODO: implement data picker. 
export default function CreateJobRequestBountyModal({ onClose, getOpen }) {
  const [loading, setLoading] = useState(false);
  const { bountyCreation, multisigCreateBountyProposal } = useContract();
  const { account } = useAccount();
  const [addressFunction, setAddressFunction] = useState("individual");
  const [multiSig, setMultiSig] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categories: [], //categories that can be specified: languages or difficulties to make it easier to match . 
    resources: [], //TODO: want this to be a list of links, either url or cids from uploaded files. 
    endData: new Date(),
    minReward: 0,
  })

  const handleTagChange = (tags) => {
    setFormData({ ...formData, categories: tags });
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const createRequest = async () => {
    //TODO: implement create request.

    if (addressFunction == "group") {
      toast.promise(multisigCreateBountyProposal(
        multiSig,
        formData.minReward,
        formData.name,
        formData.description,
        formData.categories.toString(),
      ), {
        pending: "Creating Bounty",
        success: "Bounty Created",
        error: "Error Creating Bounty"
      }).then((result) => {
        if (result) {
          onClose();
        }
      }
      )

      return;
    };
    toast.promise(bountyCreation(
      formData.name,
      formData.description,
      formData.categories.toString(),
      formData.minReward
    ), {
      pending: "Creating Bounty",
      success: "Bounty Created",
      error: "Error Creating Bounty"
    }).then((result) => {
      if (result) {
        onClose();
      }
    }
    )

  }

  function onChangeSelect(address) {
    console.log(address)
    setMultiSig(address);
  }


  return (

    <div className="flex flex-col gap-6">
      <h1 className='text-xl '>Create Job Request</h1>
      <div className='grid grid-cols-4'>
        <div className='flex flex-row gap-2 col-span-1'>
          <span onClick={() => setAddressFunction("individual")} className={`flex px-6 cursor-pointer py-2 rounded-md ${addressFunction == 'individual' && 'bg-cf-200'}`}>
            Individual
          </span>

          <span onClick={() => setAddressFunction("group")} className={`flex px-6 cursor-pointer py-2 rounded-md ${addressFunction == 'group' && 'bg-cf-200'}`}>
            Group
          </span>
        </div>
        <div className='col-span-1'>

          {addressFunction == "group" && <SelectMultiSig address={account} onChange={onChangeSelect} />}
        </div>
      </div>


      <InputField
        label="Name"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        required={true}
      />
      <InputField
        label="Minimum Reward"
        name="minReward"
        type="number"
        value={formData.minFee}
        onChange={handleChange}
      />

      <TextArea
        label="Description"
        name="description"
        rows="3"
        value={formData.description}
        onChange={handleChange}
        required={true}
      />
      <TagsInput value={formData.categories} onChange={handleTagChange} />
      <ActionButton loading={loading} onClick={createRequest} text="Create Job Bounty" />
    </div>

  )
}
