"use client";

import { formatTime } from "@/lib/dateUtils";

const TransactionItem = ({ transaction }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border">
      <div>
        <p className="font-medium">{transaction.description}</p>
        <p className="text-sm text-gray-500">
          {formatTime(transaction.date)}
        </p>
      </div>
      <span
        className={`font-semibold ${
          transaction.type === "in" ? "text-green-600" : "text-red-600"
        }`}
      >
        {transaction.type === "in" ? "+" : "-"}₹{transaction.amount}
      </span>
    </div>
  );
};

export default TransactionItem;