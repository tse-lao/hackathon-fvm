// components/Marketplace.js

import { useEffect, useState } from 'react';
import LoadingSpinner from '../application/elements/LoadingSpinner';
import Filters from '../application/overlay/Filters';
import CreateOpenDS from './CreateOpenDS';
import DatasetItem from './DatasetItem';
const categories = ['All', 'Health', 'Finance', 'Technology', 'Environment'];


const Marketplace = () => {
  const [datasets, setDatasets] = useState();


  const [openModal, setOpenModal] = useState(false);


  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchData = async () => {
      setLoading(true)
     
      const marketplace = await fetch('/api/tableland/token/all?request=true');
      const data = await marketplace.json();
      setDatasets(data.result);
      setLoading(false);
    }

    fetchData();
    
    
  }, []);

  const changeOpen = () => {
    setOpenModal(false);
  }


  if (loading) return <LoadingSpinner msg="Loading Marketplace" />;
  return (
      <div className="flex flex-col h-screen">   
      <button
      onClick={() => setOpenModal(true)}
      className="bg-cf-500 hover:bg-cf-700 self-end text-white font-bold py-2 px-4 rounded-full"
    >
     {openModal && <CreateOpenDS onClose={() => setOpenModal(false)} />}

      Create Open DS
    </button>   
      <Filters name="Data Marketplace" />
      <main>
        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {datasets.length > 0 ? datasets.map((dataset, index) => (
              <DatasetItem key={index} dataset={dataset} />
          )) : <p>No data set found</p>}
        </div>
      </main>
    </div>
  );
};

export default Marketplace;
