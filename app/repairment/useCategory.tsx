import { addDoc, updateDoc, deleteDoc, doc, Timestamp, collection, getDocs, getFirestore, limit, orderBy, query, where, and } from "firebase/firestore";
import app from "@/app/_firebase/Config"
import { useEffect, useState } from "react";
import { Period } from "../_settings/interfaces";
import React from "react";
import { format } from "date-fns";

function useCategory() {
    const db = getFirestore(app);
    const [catetory, setCategory] = useState(['']);
    const [equipment, setEquipment] = useState(['']);

    // re-render
    const [updated, setUpdated] = useState(0);

    // fecthData();
    const [isLoading, setIsLoading] = useState(false);

    // category
    useEffect(() => {
        async function fetchCategoryData() {
            setIsLoading(true);
            let data: any[] = [];
            const queryRef = collection(db, "category");

            const categoryQuery = query(queryRef, orderBy("categoryName", "desc"));
            const querySnapshot = await getDocs(categoryQuery)
            querySnapshot.forEach((doc) => {
                data.push(doc.data().categoryName)
            });
            setCategory(() => [...data]);
            setIsLoading(false);
        }
        fetchCategoryData();
    }, [db, updated]);

    return [catetory, isLoading] as const;
}

export default useCategory;