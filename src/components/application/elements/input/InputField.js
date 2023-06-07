"use client"

export default function InputField({ label, name, type, value, onChange,placeholder, required, onEnter }) {

    
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log("Enter key was pressed. Current input value: ", e.target.value);
      // call your function here
      if(onEnter) {
        
        onEnter(e.target.value)
        //add serach Params
      }
    }
  }
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          type={type}
          name={name}
          id={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          onKeyDown={handleKeyDown}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    );
  }
  