"use client"
import SearchMember from './SearchMember';

export default function AddMember({showModal, addMember}) {

    return (
  
        <div className='flex flex-col gap-12'>
           <SearchMember addMember={addMember}/>
        </div>

  )
}

