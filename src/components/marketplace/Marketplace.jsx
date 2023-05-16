// components/Marketplace.js

import { filteredWithCategories, getAllNFTs } from '@/hooks/useTableland';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../application/elements/LoadingSpinner';
import Filters from '../application/overlay/Filters';
import DatasetItem from './DatasetItem';
const categories = ['All', 'Health', 'Finance', 'Technology', 'Environment'];

const sets = [

  {
    "id": 1,
    "title": "Dataset 1",
    "category": "Health",
    "size": "1.5 GB"
  },
  {
    "id": 2,
    "title": "Dataset 2",
    "category": "Finance",
    "size": "2.2 GB"
  },
  {
    "id": 3,
    "title": "Dataset 3",
    "category": "Technology",
    "size": "3.1 GB"
  },
  {
    "id": 4,
    "title": "Dataset 4",
    "category": "Environment",
    "size": "500 MB"
  },
  {
    "id": 5,
    "title": "Dataset 5",
    "category": "Health",
    "size": "4.8 GB"
  },
  {
    "id": 6,
    "title": "Dataset 6",
    "category": "Finance",
    "size": "6.2 GB"
  },
  {
    "id": 7,
    "title": "Dataset 7",
    "category": "Technology",
    "size": "1.3 GB"
  },
  {
    "id": 8,
    "title": "Dataset 8",
    "category": "Environment",
    "size": "2.7 GB"
  },
  {
    "id": 9,
    "title": "Dataset 9",
    "category": "Health",
    "size": "3.9 GB"
  },
  {
    "id": 10,
    "title": "Dataset 10",
    "category": "Finance",
    "size": "800 MB"
  }

]

const Marketplace = () => {
  const [datasets, setDatasets] = useState(sets);
  const [activeCategories, setActiveCategories] = useState(['All']);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selected, setSelected] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //nothing here yet.. 
    setDatasets(sets)

    const fetchData = async () => {
      setLoading(true)
      if(selectedCategory != ''){
        const result = await filteredWithCategories(true, selectedCategory);
     
        setDatasets(result);
        setLoading(false);
      }
      const marketplace = await getAllNFTs(true);
     
      setDatasets(marketplace);
      setLoading(false);
    }

    fetchData();
    
    
  }, [selectedCategory]);

  const fetchDatasets = () => {
    return new Promise((resolve) => {
      const datasets =
        /* The JSON dataset provided earlier */
        sets

      setTimeout(() => {
        resolve(datasets);
      }, 500);
    });
  };

 // Method to handle multiple categories selection
/*  const handleCategoryClick = (category) => {
  if (category === 'All') {
    setActiveCategories(['All']);
  } else {
    setActiveCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((cat) => cat !== category)
        : [...prevCategories.filter((cat) => cat !== 'All'), category]
    );
  }
}; */
const handleCategoryChange = (event) => {
  setSelectedCategory(event);
}



  if (loading) return <LoadingSpinner msg="Loading Marketplace" />;
  return (
      <div className="flex flex-col h-screen">      
      <Filters name="Data Marketplace" selectChange={handleCategoryChange}/>


      <main className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {datasets.length ? datasets.map((dataset, index) => (
            <div className="flex flex-col" key={index}>
              <DatasetItem dataset={dataset} />
            </div>

          )) : (<p>No data set found</p>)}
        </div>
      </main>
    </div>
  );
};

export default Marketplace;
