"use client";

import TransactionItem from "./TransactionItem";
import { formatTime } from "@/lib/dateUtils";

const TransactionGroup = ({ date, transactions }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-500 sticky top-0 bg-gray-50 py-2">
        {date}
      </h3>
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
};

export default TransactionGroup;