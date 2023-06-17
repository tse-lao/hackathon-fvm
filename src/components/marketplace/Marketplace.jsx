// components/Marketplace.js

import { DB_main } from '@/constants';
import { useEffect, useState } from 'react';
import LoadingEmpty from '../application/elements/loading/LoadingEmpty';
import Filters from '../application/overlay/Filters';
import CreateOpenDS from './CreateOpenDS';
import DatasetItem from './DatasetItem';
import OpenDataSetItem from './open/OpenDatasetItem';


const Marketplace = () => {
  const [datasets, setDatasets] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    open: true,
    categories: []
  });

  useEffect(() => {

    const fetchData = async () => {
      setLoading(true)
      
   
      
      if(filters.open){
        const marketplace = await fetch(`/api/tableland/opendata/all`);
        const data = await marketplace.json();
        setDatasets(data.result);
      }else {
        
        
        let query = `WHERE ${DB_main}.piece_cid!='piece_cid'`;
        
        if (filters.categories.length > 0) {
          filters.categories.forEach((category, index) => {
            if(index == 0){
              query += `AND ${DB_attribute}.trait_type='category' AND (${DB_attribute}.value='${category}'`;
            }else {
              query += `OR ${DB_attribute}.value='${category}'`;
            }
            
          });
          query += ')';
        }
        if (filters.open) {
          query += `AND ${DB_main}.minRows=0`;
        }
        if(!filters.open){
          query += `AND ${DB_main}.minRows > 0`;
        }
        const marketplace = await fetch(`/api/tableland/token/all?where=${query}`);
        const data = await marketplace.json();
        setDatasets(data.result);
      }
      
      
    
      setLoading(false);
    }

    fetchData();

  }, [filters]);

  const selectChange = (changedFilters) => {
    setFilters(changedFilters)
  
  }



  if (loading) return <LoadingEmpty />;
  return (
    <div className="flex flex-col h-screen">
    
      <Filters name="Data Marketplace" selectChange={selectChange} currentFilters={filters} />
      <main>
        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {datasets.length > 0 ? datasets.map((dataset, index) =>
            filters.open ? (
            <OpenDataSetItem key={index} dataset={dataset} />
          ): (
            <DatasetItem key={index} dataset={dataset} />
            
          )
          
          ) : <p>No data set found</p>}
        </div>
      </main>
      
      
      <button
      onClick={() => setOpenModal(!openModal)}
      className="fixed bottom-12 right-12 bg-cf-500 text-white px-4 py-2 rounded"
    >
     
      Create Open DS
    </button>
    {openModal && <CreateOpenDS onClose={() => setOpenModal(!openModal)} />}

    </div>
    
  );
};

export default Marketplace;
