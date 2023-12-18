import { collection, getDocs, getFirestore, limit, query, where } from "firebase/firestore";
import app from "@/app/_firebase/config";
import { useEffect, useState } from "react";

export default function getRentId(queryCategory: string, rentNum: number, rentIdUpdate: number) {
  const db = getFirestore(app);
  const [rentId, setRentId] = useState<String[]>([]);
  const [imLoading, setImLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const equipmentRef = collection(db, "equipment");
      if (queryCategory != '' && rentNum != 0) {
        setImLoading(true);
        const queryName = query(equipmentRef,
          where("equipmentName", "==", queryCategory),
          where("equipmentStatus", "==", 1),
          limit(rentNum)
        );
        const querySnapshot = await getDocs(queryName);
        const data: String[] = querySnapshot.docs.map((doc) => (
          doc.id
        ));
        setRentId([...data]);
        setImLoading(false);
      }
    }
    fetchData();
  }, [db, rentIdUpdate]);

  return [rentId, setRentId, imLoading] as const;
}
