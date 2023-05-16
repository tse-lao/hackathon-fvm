const Contributors = ({ contributors }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 my-4">
        <h3 className="font-bold text-lg mb-2">Contributors</h3>
        {contributors.map((contributor, index) => (
          <div key={index} className="border-b border-gray-200 py-2">
            <p className="font-bold">{contributor.name}</p>
            <p>{contributor.contribution} ETH contributed</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default Contributors;