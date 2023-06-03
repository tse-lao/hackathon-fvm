import ModalLayout from '@/components/ModalLayout'
import { ActionButton } from '@/components/application/elements/buttons/ActionButton'
import InputField from '@/components/application/elements/input/InputField'
import TextArea from '@/components/application/elements/input/TextArea'
import { useState } from 'react'
import TagsInput from 'react-tagsinput'

//TODO: implement data picker. 
export default function CreateJobRequestBountyModal({ onClose, getOpen }) {
  const [loading, setLoading] = useState(false);
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
    //const submitResult = await fetch('/api/polybase/jobs/createBounty')

    window.alert("not uet implemetned")
  }


  return (
    <ModalLayout title="Job Request Bounty" onClose={onClose} getOpen={getOpen} >
      <div className="flex flex-col gap-6">
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
    </ModalLayout>
  )
}
