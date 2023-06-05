
//this needs to be a module that can be used everywhere and just returns a CID. 
export default function UploadFiles() {
  
  const upload = async(e) => {
    //here we need to add all the functionalities but it needs to be open.. 
  }


  return (
    <div>
      <input
        type="file"
        id="image"
        name="image"
        multiple
        accept="*"
        onChange={e => upload(e)}
        className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}
