import Link from "next/link";
import { useEffect, useState } from "react";
import Category from "../elements/Category";

export default function AttributeTable({ data }) {
    //three different values we get 
    const [creator, setCreator] = useState("")
    const [splitter, setSplitter] = useState("")
    const [categories, setCategories] = useState([])
    //creator

    //category
    //price

    useEffect(() => {
        setCategories([])
        
        console.log(data)
        
        var temp = []
        for (var item in data) {
            if (data[item].trait_type == "creator") {
                setCreator(data[item].value)
            }
            if (data[item].trait_type == "category") {
                temp.push(data[item].value)
      
            }
            if (data[item].trait_type == "splitterContract") {
                setSplitter(data[item].value)
            }
        }
        setCategories(temp)
    }, [data])


    return (
        <div className="flex flex-col gap-4">
            <div className="text-gray-600 flex flex-col gap-2">
                <span className="font-bold">Creator</span>
                <Link className="hover:text-cf-500" href={`/profile/${creator}`}>{creator}</Link>
            </div>
            <div className="text-gray-600 flex flex-col gap-2">
                <span className="font-bold">Splitter</span>
                <Link className="hover:text-cf-500" href={`/splitter/${splitter}`} target="blank">{splitter}</Link>
            </div>
            <div>
                {categories.map((category, index) => (
                    <Category category={category} key={index} />
                ))}
            </div>

        </div>

    );

}
