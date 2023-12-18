import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import app from "@/app/_firebase/config"
import { useEffect, useState } from "react";
import { Category } from "../_settings/interfaces";

function useCategory(queryCategory: string) {
  const db = getFirestore(app);
  const [category, setCategory] = useState<Category[]>([]);

  // fecthData();
  useEffect(() => {
    async function fetchData() {
      let data: Category[] = [];
      const queryRef = collection(db, "category");
      if (queryCategory != "") {
        const queryName = query(queryRef, where("categoryName", "==", queryCategory));
        const querySnapshot = await getDocs(queryName);
        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            categoryName: doc.data().categoryName,
            categoryQuantity: doc.data().categoryQuantity,
            rentAble: doc.data().rentAble,
            repairTotal: doc.data().repairTotal
          })
          console.log(`${doc.id} => ${doc.data()}`);
        });
        setCategory(() => [...data]);
      } else {
        const queryName = query(queryRef);
        const querySnapshot = await getDocs(queryName);
        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            categoryName: doc.data().categoryName,
            categoryQuantity: doc.data().categoryQuantity,
            rentAble: doc.data().rentAble,
            repairTotal: doc.data().repairTotal
          })
          console.log(`${doc.id} => ${doc.data()}`);
        });
        setCategory(() => [...data]);
      }
    }
    fetchData();
  }, [db, queryCategory]);

  return [category, setCategory] as const;

}
export default useCategory;



