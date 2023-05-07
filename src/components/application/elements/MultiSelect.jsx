
const MultiSelect = ({ options, selectedValues, onChange }) => {
  const handleChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions).map(
      (option) => option.value
    );
    onChange(selectedOptions);
  };

  return (
    <select
      multiple
      value={selectedValues}
      onChange={handleChange}
      className="border border-gray-300 rounded-md p-2"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default MultiSelect;
