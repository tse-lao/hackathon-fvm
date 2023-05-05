// components/DatasetItem.js


const DatasetItem = ({ dataset }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-2">{dataset.title}</h3>
      <p>
        <strong>Category:</strong> {dataset.category}
      </p>
      <p>
        <strong>Size:</strong> {dataset.size}
      </p>
    </div>
  );
};

export default DatasetItem;
