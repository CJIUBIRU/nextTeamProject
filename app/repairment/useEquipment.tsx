import { addDoc, updateDoc, deleteDoc, doc, Timestamp, collection, getDocs, getFirestore, limit, orderBy, query, where, and } from "firebase/firestore";
import app from "@/app/_firebase/Config"
import { useEffect, useState } from "react";
import { Period } from "../_settings/interfaces";
import React from "react";
import { format } from "date-fns";

function useEquipment(queryCategory: string) {
    const db = getFirestore(app);
    const [equipment, setEquipment] = useState(['']);

    // re-render
    const [updated, setUpdated] = useState(0);

    // fecthData();
    const [isLoading, setIsLoading] = useState(false);

    // equipment
    useEffect(() => {
        async function fetchEquipmentData() {
            setIsLoading(true);
            let data2: any[] = [];
            const queryRef = collection(db, "equipment");

            if (queryCategory.length > 0) {
                const equipmentQuery = query(queryRef, and(where("equipmentName", "==", queryCategory), where("equipmentStatus", "==", 1)));
                const querySnapshotEquipment = await getDocs(equipmentQuery)
                querySnapshotEquipment.forEach((doc2) => {
                    data2.push(doc2.id)
                });
            } else {
                data2.push('請先選擇器材種類');
            }
            setEquipment(() => [...data2]);

            setIsLoading(false);
        }
        fetchEquipmentData();
    }, [db, queryCategory, updated]);

    return [equipment, isLoading] as const;
}

export default useEquipment;