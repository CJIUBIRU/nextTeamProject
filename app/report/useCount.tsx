import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import app from "../_firebase/Config";
import { useEffect, useState } from "react";

export default function useCount() {
  const db = getFirestore(app);
  const [status, setStatus] = useState<{ name: string; count: number }[]>([]);

  // fetch data
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, "equipment"));

      const categoryCountMap: { [key: string]: number } = {};

      querySnapshot.forEach((doc) => {
        const equipmentName = doc.data().equipmentName;
        const equipmentStatus = doc.data().equipmentStatus;

        // 1 可租借
        if (equipmentStatus === 1) {
          categoryCountMap[equipmentName] = (categoryCountMap[equipmentName] || 0) + 1;
        }
      });

      const categoriesArray = Object.entries(categoryCountMap).map(([name, count]) => ({
        name,
        count,
      }));

      setStatus(categoriesArray);
      setIsLoading(false);
    }

    fetchData();
  }, [db]);

  return [status, setStatus, isLoading] as const;
}
