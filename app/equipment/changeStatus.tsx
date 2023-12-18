import { doc, getFirestore, updateDoc } from "firebase/firestore";
import app from "@/app/_firebase/config";
import { useState } from "react";

async function changeStatus(rentId: String[]) {
  const db = getFirestore(app);
  // console.log(rentId)
  try {
    for (let i = 0; i < rentId.length; i++) {
      // console.log ("index" + i + ":", rentId[i]);
      await updateDoc(doc(db, "equipment", String(rentId[i])), {
        equipmentStatus: 0
      });
    }
  } catch (error) {
    console.error(error);
  }
}
export default changeStatus;