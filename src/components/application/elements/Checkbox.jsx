
const CheckboxSelect = ({ options, selectedValues, onChange }) => {
  const handleChange = (event) => {
    const { value, checked } = event.target;
    let updatedSelectedValues = [...selectedValues];

    if (checked) {
      updatedSelectedValues.push(value);
    } else {
      updatedSelectedValues = updatedSelectedValues.filter(
        (item) => item !== value
      );
    }

    onChange(updatedSelectedValues);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((option) => (
        <label key={option} className="inline-flex items-center">
          <input
            type="checkbox"
            value={option}
            checked={selectedValues.includes(option)}
            onChange={handleChange}
            className="mr-2"
          />
          {option}
        </label>
      ))}
    </div>
  );
};

export default CheckboxSelect;
