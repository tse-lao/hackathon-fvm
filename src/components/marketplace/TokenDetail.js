import Category from "../application/elements/Category";

const TokenDetail = ({ token }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 my-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold mb-2">{token.dbName}</h2>
          <div>
            <button className="bg-black text-white rounded-lg px-4 py-2 mr-2">
              Buy
            </button>
          </div>
        </div>
        <img src="/placeholder-image.jpg" alt={token.dbName} className="w-full h-64 object-cover rounded-md mb-4" />
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">Description</h3>
          <p>{token.description}</p>
          
          <div>
            {token.attributes && token.attributes.map((attribute, index) => 
                attribute.trait_type == "category" &&
                    <Category key={index} category={attribute.value} />

               
                )}
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">Details</h3>
          <p>
            <strong>TokenID:</strong> {token.tokenID}
          </p>
          <p>
            <strong>Minimum Rows On Submission:</strong> {token.minimumRowsOnSubmission}
          </p>
          <p>
            <strong>DB CID:</strong> {token.dbCID}
          </p>
        </div>
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">Owner</h3>
          <p>{token.owner}</p> {/* Please replace this with real owner data */}
        </div>
      </div>
    );
  };
  
  export default TokenDetail;
  