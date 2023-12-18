import { addDoc, updateDoc, deleteDoc, doc, Timestamp, collection, getDocs, getFirestore, limit, orderBy, query, where, and } from "firebase/firestore";
import app from "../_firebase/Config";
import { useEffect, useState } from "react";
import { Period } from "../_settings/interfaces";
import React from "react";
import { format } from "date-fns";

function useSchedule(queryText: number, queryUpdate: number) {
  const db = getFirestore(app);
  const [period, setPeriod] = useState<Period[]>([]);

  //getToday
  const [newDate, setnewDate] = React.useState(new Date());
  const today = format(newDate, "M/d/yyyy");

  //re-render
  const [updated, setUpdated] = useState(0);

  // fecthData();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      let data: Period[] = [];
      const queryRef = collection(db, "schedule");
      if (queryText != 0) {
        const queryId = query(queryRef, and(where("date", "==", today), where("userId", "==", queryText)));
        const querySnapshot = await getDocs(queryId);
        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            userId: doc.data().userId,
            userName: doc.data().userName,
            category: doc.data().equipmentCategory,
            quantity: doc.data().equipmentQuantity,
            period: doc.data().period,
            rentId: doc.data().rentId,
            rentTime: doc.data().rentTime,
            returnTime: doc.data().returnTime,
            date: doc.data().date
          })
          console.log(`${doc.id} => ${doc.data()}`);
        });
        setPeriod(() => [...data]);
        setIsLoading(false);
      }

      else {
        const periodQuery = query(queryRef, where("date", "==", today), orderBy("rentTime", "desc"));
        const querySnapshot = await getDocs(periodQuery)
        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            userId: doc.data().userId,
            userName: doc.data().userName,
            category: doc.data().equipmentCategory,
            quantity: doc.data().equipmentQuantity,
            period: doc.data().period,
            rentId: doc.data().rentId,
            rentTime: doc.data().rentTime,
            returnTime: doc.data().returnTime,
            date: doc.data().date
          })
          console.log(`${doc.id} => ${doc.data()}`);
        });
        setPeriod(() => [...data]);
        setIsLoading(false);
      }
    }
    fetchData();
  }, [db, updated, queryUpdate]);

  async function addPeriod(period: Period) {
    const docRef = await addDoc(collection(db, "schedule"), {
      userId: period.userId,
      userName: period.userName,
      equipmentCategory: period.category,
      equipmentQuantity: period.quantity,
      period: period.period,
      rentId: period.rentId,
      rentTime: period.rentTime,
      returnTime: period.returnTime,
      date: period.date
    });
    console.log("Document written with ID: ", docRef.id);
    setUpdated((currentValue) => currentValue + 1)
  }

  async function deletePeriod(id: string) {
    try {
      await deleteDoc(doc(db, "schedule", id));
      setUpdated((currentValue) => currentValue + 1)
    }
    catch (error) {
      console.error(error);
    }

  }
  async function updatePeriod(period: Period) {
    try {
      const db = getFirestore(app);
      await updateDoc(doc(db, "schedule", period.id), {
        userId: period.userId,
        userName: period.userName,
        equipmentCategory: period.category,
        equipmentQuantity: period.quantity,
        period: period.period,
        rentId: period.rentId,
        rentTime: period.rentTime,
        returnTime: period.returnTime,
        date: period.date
      });
      setUpdated((currentValue) => currentValue + 1)
    }
    catch (error) {
      console.error(error);
    }

  }

  return [period, setPeriod, addPeriod, deletePeriod, updatePeriod, isLoading] as const;

}
export default useSchedule;