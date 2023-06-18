export default function TextArea({ label, name, rows, value, onChange, required, code }) {
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-bold text-gray-700">
          {label}
        </label>
        <textarea
          name={name}
          id={name}
          rows={rows}
          value={value}
          onChange={onChange}
          required={required}
          className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${code && 'bg-black text-green-600 font-bold focus:ring-green-300'}`}
        ></textarea>
      </div>
    );
  }
  