// components/Marketplace.js

import { useEffect, useState } from 'react';
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
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    //nothing here yet.. 
    setDatasets(sets)
  }, []);
  
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

  const filteredDatasets = datasets.filter(
    (dataset) =>
      activeCategory === 'All' || dataset.category === activeCategory
  );

  return (
    <div className="flex">
    
     
      <aside className="bg-white shadow-md rounded-lg p-6 mr-6 w-1/4">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <ul>
          {categories.map((category, index) => (
            <li
              key={index}
              onClick={() => setActiveCategory(category)}
              className={`cursor-pointer mb-2 ${
                activeCategory === category
                  ? 'text-indigo-500 font-semibold'
                  : 'text-gray-700'
              }`}
            >
              {category}
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1">
        <h2 className="text-2xl font-semibold mb-4">Datasets</h2>
        <div className="grid grid-cols-3 gap-6">
          {filteredDatasets.map((dataset) => (
            <DatasetItem key={dataset.id} dataset={dataset} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Marketplace;
