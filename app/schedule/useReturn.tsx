import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import app from "@/app/_firebase/config";
import { useEffect } from "react";
import useSchedule from "./useSchedule";

export default function useReturn(id: string, returnUpdate: number) {

  const db = getFirestore(app);
  useEffect(() => {
    async function fetchData() {
      console.log(id)
      if (id != '') {
        const docRef = doc(db, 'schedule', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const rentId = docSnap.data().rentId;
          const category = docSnap.data().equipmentCategory;
          const quantity = docSnap.data().equipmentQuantity;

          //update rentAble
          const queryRef = collection(db, "category");
          const queryName = query(queryRef, where("categoryName", "==", category));
          const querySnapshot = await getDocs(queryName);
          const storeNum: any = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            rentAble: doc.data().rentAble
          }));
          let currentNum = storeNum[0].rentAble + quantity
          try {
            await updateDoc(doc(db, "category", storeNum[0].id), {
              rentAble: currentNum
            });

          } catch (error) {
            console.error(error);
          }

          //update status
          try {
            for (let i = 0; i < rentId.length; i++) {
              // console.log ("index" + i + ":", rentId[i]);
              await updateDoc(doc(db, "equipment", String(rentId[i])), {
                equipmentStatus: 1
              });
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
    fetchData();
  }, [db, returnUpdate]);

}
