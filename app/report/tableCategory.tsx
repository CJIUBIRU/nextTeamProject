'use client'
import { collection, getDocs, getFirestore } from "firebase/firestore"
import app from "../_firebase/Config"
import { useEffect, useState } from "react"
import { Category } from "../_settings/interfaces";

export default function tableCategory() {
  const db = getFirestore(app);
  const [tablecategory, setTable] = useState<Category[]>([]);

  // fetch data
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      let data: Category[] = [];
      const querySnapshot = await getDocs(collection(db, "category"));
      querySnapshot.forEach((doc) => {
        data.push({ 
          id: doc.id,
          categoryName: doc.data().categoryName,
          categoryQuantity: doc.data().categoryQuantity,
          rentAble: doc.data().rentAble,
          repairTotal: doc.data().repairTotal,
        });
      });
      setTable(() => [...data]);
      setIsLoading(false);
    }
  
    fetchData();
  }, [db]);
  
  return [tablecategory, setTable, isLoading] as const;
}

