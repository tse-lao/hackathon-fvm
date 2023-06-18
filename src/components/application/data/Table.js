
export default function Table  ({ data }){
return(
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        {Object.keys(data[0]).map((key, index) => (
          <th
            key={index}
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider"
          >
            {key}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((item, index) => (
        <tr key={index}>
          {Object.values(item).map((val, index) => (
            <td key={index} className="px-6 py-4 whitespace-nowrap overflow-auto">
              <div className="text-sm text-gray-900 overflow-auto">{val}</div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
}