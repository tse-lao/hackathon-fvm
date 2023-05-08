import { useCollection, usePolybase } from '@polybase/react';
import { useState } from 'react';
import QuickAddButton from '../../elements/QuickAddButton';
import CreateFolderModal from './CreateFolderModal';
import Folder from './Folder';
import folders from './data/folders.json';

function Folders() {
  const [expandedFolders, setExpandedFolders] = useState({ [folders[0].id]: true });
  const [modalOpen, setModalOpen] = useState(false);
  
  const polybase = usePolybase();
  const { data, error, loading } =
    useCollection(polybase.collection("Folder"));


    
  
  if(loading) return <p>Loading...</p>
  
  if(error) return <p>Error: {error.message}</p>
  

  const setOpenModal = () => {
    console.log(data);
      setModalOpen(!modalOpen);
  }
  function handleToggle(id) {
    console.log(id)
    setExpandedFolders((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  }
  
  
  
  return (
    <div>
    {data && data.data.map((folder) => (
        console.log(folder),
        <Folder
            key={folder.id}
            folder={folder}
            isExpanded={expandedFolders[folder.id]}
            onToggle={handleToggle}
        />
    )) }
      {folders.map((folder) => (
        <Folder
          key={folder.id}
          folder={folder}
          isExpanded={expandedFolders[folder.id]}
          onToggle={handleToggle}
        />
      ))}
      
      {modalOpen && (
        <CreateFolderModal changeOpenModal={setOpenModal}/>
)}
<QuickAddButton setOpenModal={setOpenModal}/>
    </div>
    
    
  );
}

export default Folders;


