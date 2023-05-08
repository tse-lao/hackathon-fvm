import { DocumentIcon, FolderIcon } from '@heroicons/react/24/outline';


export default function Folder({ folder, isExpanded, onToggle }) {
  function handleClick(event) {
    event.stopPropagation();
    onToggle(folder.id);
  }

  return (
    <div>
      <div className="flex items-center cursor-pointer" onClick={handleClick}>
        <FolderIcon className="h-5 w-5 text-gray-500 mr-2" />
        <span className="font-medium hover:text-indigo-500">{folder.name}</span>
      </div>
      {isExpanded && (
        <div className="pl-4">
          {folder.subfolders?.map((subfolder) => (
            <Folder
              key={subfolder.id}
              folder={subfolder}
              isExpanded={isExpanded[subfolder.id]}
              onToggle={onToggle}
            />
          ))}
          {folder.files?.map((file) => (
            <div key={file.id} className="flex items-center">
              <DocumentIcon className="h-5 w-5 text-gray-500 mr-2" />
              <span>{file.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
