import { collection, doc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import app from "@/app/_firebase/config"
import { useEffect, useState } from "react";

function changeRentAble(queryCategory: string, rentNum: number, rentUpdate: number) {

  const db = getFirestore(app);
  useEffect(() => {
    async function fetchData() {
      const queryRef = collection(db, "category");
      if (queryCategory != '' && rentNum != 0) {
        const queryName = query(queryRef, where("categoryName", "==", queryCategory));
        const querySnapshot = await getDocs(queryName);
        const storeNum: any = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          rentAble: doc.data().rentAble
        }));
        // console.log('id', storeNum[0].id)
        // console.log('rentAble', storeNum[0].rentAble)
        let currentNum = storeNum[0].rentAble - rentNum
        try {
          await updateDoc(doc(db, "category", storeNum[0].id), {
            rentAble: currentNum
          });

        } catch (error) {
          console.error(error);
        }
      }
    }
    fetchData();
  }, [db, rentUpdate]);


}
export default changeRentAble;