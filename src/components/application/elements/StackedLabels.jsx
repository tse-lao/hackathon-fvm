export default function StackedLabels ({ labels }) {
    return (
      <div className="relative h-10 w-32">
        {labels.map((label, idx) => (
          <div
            key={idx}
            className={`absolute top-0 left-0 h-full w-full text-white bg-indigo-500 border border-gray-300 flex items-center justify-center text-sm cursor-pointer transform transition-all duration-200 hover:scale-105 hover:z-10`}
          >
            {label.value}
          </div>
        ))}
      </div>
    );
  };