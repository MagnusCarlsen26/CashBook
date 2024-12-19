"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle, Calendar } from "lucide-react";
import { format } from "date-fns";
import TransactionList from '@/components/TransactionList'
import { formatTime } from "@/lib/dateUtils";
import { InputGroup, FormControl, Dropdown, DropdownButton } from 'react-bootstrap';

export default function Home() {
  const [transactions, setTransactions] = useState([
    { id: "1", type: "in", amount: 15000, description: "Salary", date: new Date() },
    { id: "1", type: "in", amount: 15000, description: "Saalary", date: new Date() },
    { id: "1", type: "in", amount: 15000, description: "Saaalary", date: new Date() },
    { id: "1", type: "in", amount: 1200, description: "Electricity", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: "1", type: "out", amount: 500, description: "Water", date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },

  ]);

  const [newTransaction, setNewTransaction] = useState({
    type: "in",
    amount: "",
    description: "",
  });

  const totalCashIn = transactions.reduce(
    (sum, t) => sum + (t.type === "in" ? t.amount : 0),
    0
  );
  const totalCashOut = transactions.reduce(
    (sum, t) => sum + (t.type === "out" ? t.amount : 0),
    0
  );

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!newTransaction.amount || !newTransaction.description) return;
    const inputTime = new Date()
    console.log(inputTime,'e')
    setTransactions([
      {
        id: Date.now().toString(),
        ...newTransaction,
        amount: Number(newTransaction.amount),
        date: new Date(),
      },
      ...transactions,
    ]);

    setNewTransaction({ type: "in", amount: "", description: "" });
  };

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const allSuggestions = transactions.map( transaction => transaction.description )
  
  const handleInputChange = (e: { target: { value: any; }; }) => {

    const value = e.target.value;
    console.log(allSuggestions)
    console.log(value)
    setNewTransaction({ ...newTransaction, description: value });

    if (value.length > 0) {
      const filteredSuggestions = allSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      console.log(suggestions,'f')
    } else {
      setSuggestions([]);
    }
  }; 

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
                onClick={() => setNewTransaction({ ...newTransaction, type: "in" })}
                className="flex-1"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Cash In
              </Button>
              <Button
                type="button"
                variant={newTransaction.type === "out" ? "default" : "outline"}
                onClick={() => setNewTransaction({ ...newTransaction, type: "out" })}
                className="flex-1"
              >
                <MinusCircle className="mr-2 h-4 w-4" />
                Cash Out
              </Button>
            </div>
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
            {suggestions.map( (suggestion,index) => <Button
              key={index}
              variant="destructive"
              type="button"
              onClick={() => {
                setNewTransaction({ ...newTransaction, description : suggestion })
                setSuggestions([])
              }}
              className="flex min-w-full bg-white text-black border m-0 p-0"
            >
              {suggestion}
            </Button>)}
            {/* <InputGroup className="mb-3">
              <FormControl
                placeholder="Description"
                aria-label="Description"
                aria-describedby="basic-addon2"
                value={newTransaction.description}
                onChange={handleInputChange}
              />
              {suggestions.length > 0 && (
                <DropdownButton
                  as={InputGroup.Append}
                  variant="outline-secondary"
                  title=""
                  id="input-group-dropdown-2"
                >
                  {suggestions.map((suggestion, index) => (
                    <Dropdown.Item key={index} onClick={() => setNewTransaction({ ...newTransaction, description: suggestion })}>
                      {suggestion}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              )}
            </InputGroup> */}
            <Button type="submit" className="w-full my-4">Save Transaction</Button>
          </form>

        </Card>

        <TransactionList transactions={transactions}/>
        
        <Card className="p-6">
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
