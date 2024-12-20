import { db } from "@/firebase/config";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";

export async function readTransactions() {
    const querySnapshot = await getDocs(collection(db, "transactions"));
    let transactions = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });

    transactions = transactions.map( transaction => ({
      ...transaction,
      date : (transaction.date).toDate()
    }) )

    return transactions
}