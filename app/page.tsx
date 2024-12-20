"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle } from "lucide-react";
import TransactionList from '@/components/TransactionList';
import { db } from "@/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { readTransactions } from "@/lib/db"
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';

// Define the type for transaction
type Transaction = {
  id: string;
  type: "in" | "out";
  amount: number;
  description: string;
  date: Date;
};

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<any>(dayjs());
  const [showInputField, setShowInputField] = useState({ isShow: false, last: "" });
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Specify type
  const [newTransaction, setNewTransaction] = useState<{
    type: "in" | "out";
    amount: string;
    description: string;
  }>({
    type: "in",
    amount: "",
    description: "",
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Total cash in/out calculations
  const totalCashIn = transactions.reduce(
    (sum, t) => sum + (t.type === "in" ? t.amount : 0),
    0
  );
  const totalCashOut = transactions.reduce(
    (sum, t) => sum + (t.type === "out" ? t.amount : 0),
    0
  );

  // Handle form submission
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!newTransaction.amount || !newTransaction.description) return;

    await setDoc(doc(db, "transactions", Date.now().toString()), {
      id: Date.now().toString(),
      type: newTransaction.type,
      amount: Number(newTransaction.amount),
      description: newTransaction.description,
      date: selectedDate.toDate(),
    });
    console.log(selectedDate)
    setTransactions([
      {
        id: Date.now().toString(),
        type: newTransaction.type, // Type casting unnecessary now
        amount: Number(newTransaction.amount),
        description: newTransaction.description,
        date: selectedDate.toDate(),
      },
      ...transactions,
    ]);
    setNewTransaction({ type: "in", amount: "", description: "" });
    setShowInputField({
      isShow : false,
      last : ""
    })
  };

  // Suggestions based on existing transactions
  const allSuggestions = transactions.map(transaction => transaction.description);

  const handleInputChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    setNewTransaction({ ...newTransaction, description: value });

    if (value.length > 0) {
      const filteredSuggestions = allSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Read transactions from Firestore
  useEffect(() => {
    async function foo() {
      setTransactions( await readTransactions() )
    }
    foo()
  }, []);

  console.log(selectedDate.toDate())

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Cash Book</h1>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-4 my-4">
              <Button
                type="button"
                variant={newTransaction.type === "in" ? "default" : "outline"}
                onClick={() => {
                  setNewTransaction({ ...newTransaction, type: "in" });
                  setShowInputField(prevStatus => ({
                    isShow: prevStatus.last === "in" ? !prevStatus.isShow : true,
                    last: "in",
                  }));
                }}
                className="flex-1"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Cash In
              </Button>
              <Button
                type="button"
                variant={newTransaction.type === "out" ? "default" : "outline"}
                onClick={() => {
                  setNewTransaction({ ...newTransaction, type: "out" });
                  setShowInputField(prevStatus => ({
                    isShow: prevStatus.last === "out" ? !prevStatus.isShow : true,
                    last: "out",
                  }));
                }}
                className="flex-1"
              >
                <MinusCircle className="mr-2 h-4 w-4" />
                Cash Out
              </Button>
            </div>
            {showInputField.isShow && <>
              <Input
                placeholder="Amount"
                type="number"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                className="my-4"
              />
              <Input
                placeholder="Description"
                type="text"
                value={newTransaction.description}
                onChange={handleInputChange}
                className="form-control mt-4"
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {/* <DateCalendar 
                  value={selectedDate}
                  onChange={(newDate) => setSelectedDate(newDate)}
                /> */}
                  <StaticDateTimePicker defaultValue={dayjs(new Date())} 
                  onChange={(newDate) => setSelectedDate(newDate)}
                  />
              </LocalizationProvider>
              
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="destructive"
                  type="button"
                  onClick={() => {
                    setNewTransaction({ ...newTransaction, description: suggestion });
                    setSuggestions([]);
                  }}
                  className="flex min-w-full bg-white text-black border m-0 p-0"
                >
                  {suggestion}
                </Button>
              ))}
              <Button type="submit" className="w-full my-4">Save Transaction</Button>
            </>}
          </form>
        </Card>

        <TransactionList transactions={transactions} />

        <Card className="p-6 fixed bottom-0 w-full max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Cash In</p>
              <p className="text-xl font-bold text-green-600">₹{totalCashIn}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Cash Out</p>
              <p className="text-xl font-bold text-red-600">₹{totalCashOut}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Balance</p>
              <p className="text-xl font-bold">₹{totalCashIn - totalCashOut}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
