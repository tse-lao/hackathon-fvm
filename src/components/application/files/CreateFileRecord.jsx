import { usePolybase } from '@polybase/react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAccount } from 'wagmi';
import CheckboxSelect from '../elements/Checkbox';
import Button from '../elements/buttons/Button';

export default function CreateFileRecord({ record }) {
    const polybase = usePolybase();
    const { address } = useAccount();
    const [selectedCategories, setSelectedCategories] = useState([]);

    const categories = [
        'Mobility',
        'Ad Preferences',
        'Health',
        'Interactions',
        'Interests',
    ];

    const handleCategoryChange = (newSelectedCategories) => {
        setSelectedCategories(newSelectedCategories);
    };


    //constructor(id: string, name: string, cid: string, metadata:string, addedAt: string){
    const createRecord = async () => {
        
        //check if metadat is not zero
        if(metadata.length == 0){
            return;
            
        }
        const newId = uuidv4();
        const getCreation = await polybase
            .collection("File")
            .create([
                newId,
                file.fileName,
                file.cid,
                file.encryption,
                metadata,
                new Date().toISOString(),
            ]);
        console.log(getCreation);
    }
    return (
        <div>
        <CheckboxSelect
        options={categories}
        selectedValues={selectedCategories}
        onChange={handleCategoryChange}
      />

            <Button name="Create Record" onClick={createRecord} />
        </div>
    )
}


