import { readFromCID } from "@/hooks/useNftStorage";
import { useEffect, useState } from "react";
import LoadingSpinner from "../application/elements/LoadingSpinner";

const json = 
    [
        {
          "name": "CrosbyZephyr #1",
          "description": "First dynmiclly generated NTFs...please buy them 🤑",
          "file_url": "ipfs://NewUriToReplace/1.png",
          "custom_fields": {
            "dna": "cb2f873183185297de44754c479451f3b27f23a4",
            "edition": 1,
            "date": 1641229239589,
            "compiler": "HashLips Art Engine"
          },
          "external_url": "https://youtube.com/crosbyroads",
          "attributes": [
            {
              "trait_type": "Background",
              "value": "Black"
            },
            {
              "trait_type": "Eyeball",
              "value": "Red"
            },
            {
              "trait_type": "Eye color",
              "value": "Cyan"
            },
            {
              "trait_type": "Iris",
              "value": "Small"
            },
            {
              "trait_type": "Shine",
              "value": "Shapes"
            },
            {
              "trait_type": "Bottom lid",
              "value": "High"
            },
            {
              "trait_type": "Top lid",
              "value": "Low"
            }
          ]
        },
        {
          "name": "CrosbyZephyr #2",
          "description": "First dynmiclly generated NTFs...please buy them 🤑",
          "file_url": "ipfs://NewUriToReplace/2.png",
          "custom_fields": {
            "dna": "f795dbbebbe18288e2db37c0dcf21e202823d597",
            "edition": 2,
            "date": 1641229239809,
            "compiler": "HashLips Art Engine"
          },
          "external_url": "https://youtube.com/crosbyroads",
          "attributes": [
            {
              "trait_type": "Background",
              "value": "Black"
            },
            {
              "trait_type": "Eyeball",
              "value": "White"
            },
            {
              "trait_type": "Eye color",
              "value": "Yellow"
            },
            {
              "trait_type": "Iris",
              "value": "Small"
            },
            {
              "trait_type": "Shine",
              "value": "Shapes"
            },
            {
              "trait_type": "Bottom lid",
              "value": "Low"
            },
            {
              "trait_type": "Top lid",
              "value": "Middle"
            }
          ]
        },
        {
          "name": "CrosbyZephyr #3",
          "description": "First dynmiclly generated NTFs...please buy them 🤑",
          "file_url": "ipfs://NewUriToReplace/3.png",
          "custom_fields": {
            "dna": "9391101cdc4c1858448b86139d3909304b540965",
            "edition": 3,
            "date": 1641229240017,
            "compiler": "HashLips Art Engine"
          },
          "external_url": "https://youtube.com/crosbyroads",
          "attributes": [
            {
              "trait_type": "Background",
              "value": "Black"
            },
            {
              "trait_type": "Eyeball",
              "value": "White"
            },
            {
              "trait_type": "Eye color",
              "value": "Red"
            },
            {
              "trait_type": "Iris",
              "value": "Large"
            },
            {
              "trait_type": "Shine",
              "value": "Shapes"
            },
            {
              "trait_type": "Bottom lid",
              "value": "Middle"
            },
            {
              "trait_type": "Top lid",
              "value": "Low"
            }
          ]
        },
        {
          "name": "CrosbyZephyr #4",
          "description": "First dynmiclly generated NTFs...please buy them 🤑",
          "file_url": "ipfs://NewUriToReplace/4.png",
          "custom_fields": {
            "dna": "69ae56a4608893e41edcf2484be75dbb86b75766",
            "edition": 4,
            "date": 1641229240231,
            "compiler": "HashLips Art Engine"
          },
          "external_url": "https://youtube.com/crosbyroads",
          "attributes": [
            {
              "trait_type": "Background",
              "value": "Black"
            },
            {
              "trait_type": "Eyeball",
              "value": "Red"
            },
            {
              "trait_type": "Eye color",
              "value": "Yellow"
            },
            {
              "trait_type": "Iris",
              "value": "Medium"
            },
            {
              "trait_type": "Shine",
              "value": "Shapes"
            },
            {
              "trait_type": "Bottom lid",
              "value": "Middle"
            },
            {
              "trait_type": "Top lid",
              "value": "High"
            }
          ]
        },
        {
          "name": "CrosbyZephyr #5",
          "description": "First dynmiclly generated NTFs...please buy them 🤑",
          "file_url": "ipfs://NewUriToReplace/5.png",
          "custom_fields": {
            "dna": "38776d4f22f7c597e160bbd3eede45a2fe753fd9",
            "edition": 5,
            "date": 1641229240440,
            "compiler": "HashLips Art Engine"
          },
          "external_url": "https://youtube.com/crosbyroads",
          "attributes": [
            {
              "trait_type": "Background",
              "value": "Black"
            },
            {
              "trait_type": "Eyeball",
              "value": "White"
            },
            {
              "trait_type": "Eye color",
              "value": "Purple"
            },
            {
              "trait_type": "Iris",
              "value": "Small"
            },
            {
              "trait_type": "Shine",
              "value": "Shapes"
            },
            {
              "trait_type": "Bottom lid",
              "value": "Low"
            },
            {
              "trait_type": "Top lid",
              "value": "High"
            }
          ]
        }
    ]
export default function DataFormatPreview({cid}) {
  //read the CID 
  const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    // mread the from nft storage. 
    const readData = async () => {
      setLoading(true);
      const result = await readFromCID(cid)
      setData(result);
      
      console.log(result)
      console.log(result);
      setLoading(false);
    }
    
    console.log(cid)
    if(!cid) return;
    readData();
  }, [cid])
  
  
  if(loading) { return <LoadingSpinner /> }
  return (
    <pre className="overflow-auto max-h-96 p-6 text-xs">
        {JSON.stringify(data, null, 1)}
    </pre>
  )
}
