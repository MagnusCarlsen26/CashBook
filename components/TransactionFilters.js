"use client";

const TransactionFilters = ({ activePeriod, onPeriodChange }) => {
  const periods = ['all', 'daily', 'weekly', 'monthly'];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => onPeriodChange(period)}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            activePeriod === period
              ? 'bg-white text-blue-500'
              : 'bg-blue-600'
          }`}
        >
          {period.charAt(0).toUpperCase() + period.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default TransactionFilters;