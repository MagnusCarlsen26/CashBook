"use client";

import { useState, useEffect } from 'react';
import { 
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './useAuth';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
      }));
      setTransactions(transactionData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTransaction = async (transactionData) => {
    try {
      await addDoc(collection(db, 'transactions'), {
        ...transactionData,
        userId: user.uid,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const totalCashIn = transactions.reduce(
    (sum, t) => sum + (t.type === "in" ? t.amount : 0),
    0
  );

  const totalCashOut = transactions.reduce(
    (sum, t) => sum + (t.type === "out" ? t.amount : 0),
    0
  );

  return {
    transactions,
    addTransaction,
    totalCashIn,
    totalCashOut,
    loading
  };
};