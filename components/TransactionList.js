"use client"

import { useState } from "react"
import { filterTransactionsByPeriod, groupTransactionsByDate } from "@/lib/dateUtils"
import TransactionFilters from "./TransactionFilters"
import TransactionGroup from "./TransactionGroup"
import TransactionItem from "./TransactionItem"
import { groupTransactionByPeriod } from "@/lib/dateUtils"

const TransactionList = ({ transactions }) => {
  const [activePeriod, setActivePeriod] = useState("all")

  let groupedTransactions
  if (activePeriod !== "all") groupedTransactions = groupTransactionByPeriod(transactions,activePeriod)

  return (
    <div className="space-y-6">
      <div className="bg-blue-500 text-white p-4 rounded-lg">
        <TransactionFilters 
          activePeriod={activePeriod}
          onPeriodChange={setActivePeriod}
        />
      </div>

      <div className="space-y-6">
        {
          activePeriod === "all" ? transactions.map( (transaction,index) => <TransactionItem key={index}  transaction={transaction}/>) :
          Object.keys(groupedTransactions).map( ( date,index ) => 
            <TransactionGroup 
              key={index}
              date={date}
              transactions={groupedTransactions[date]}
            />
          )
        }
      </div>
    </div>
  )
}

export default TransactionList