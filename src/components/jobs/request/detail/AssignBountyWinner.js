import ModalLayout from '@/components/ModalLayout'
import { ActionButton } from '@/components/application/elements/buttons/ActionButton'
import InputField from '@/components/application/elements/input/InputField'
import TextArea from '@/components/application/elements/input/TextArea'
import { useContract } from '@/hooks/useContract'
import { useState } from 'react'
import { toast } from 'react-toastify'

//TODO: implement data picker. 
export default function AssignBountyWinner({ onClose, getOpen, selected, bountyID }) {
  const [loading, setLoading] = useState(false);
  const {assignBountyResult} = useContract();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  console.log(      bountyID, 
    formData.name, 
    formData.description,
    selected.dataFormat, 
    selected.startCommand, 
    selected.endCommand, 
    selected.numOfInputs, 
    selected.creator)
    
    let dataFormat = selected.dataFormat
    if(!dataFormat){
        dataFormat = "no_metdata"
    }
  const assignWinner = async () => {
    //TODO: implement create request.
    toast.promise(assignBountyResult(
        bountyID, 
      formData.name, 
      formData.description,
      dataFormat,
      selected.startCommand, 
      selected.endCommand, 
      selected.numOfInputs, 
      selected.creator
    ),{
      pending: "Creating Bounty",
      success: "Bounty Created",
      error: "Error Creating Bounty"
    }).then((result) => {
      if(result) {
        onClose();
      }
    }
    )
    
  }


  return (
    <ModalLayout title="Assign Bounty Winner" onClose={onClose} getOpen={getOpen} >
      <div className="flex flex-col gap-6">
        <span>Bounty ID: {bountyID}</span>
        <span>Selected: {selected.name}</span>
        <InputField
          label="Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required={true}
        />
        <TextArea
        label="Description"
        name="description"
        rows="3"
        value={formData.description}
        onChange={handleChange}
        required={true}
      />
        

        <ActionButton loading={loading} onClick={assignWinner} text="Assign Winner" />
      </div>
    </ModalLayout>
  )
}