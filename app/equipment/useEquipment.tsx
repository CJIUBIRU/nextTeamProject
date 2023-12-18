import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, updateDoc } from "firebase/firestore";
import app from "@/app/_firebase/config";
import { useEffect, useState } from "react";
import { Equipment } from "@/app/_settings/interface"; // 引入器材類型定義

export default function useEquipments() {
    const db = getFirestore(app);
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [updated, setUpdated] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const equipmentRef = collection(db, "equipment");
            const querySnapshot = await getDocs(equipmentRef);
            const data: Equipment[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                equipmentName: doc.data().equipmentName,
                equipmentStatus: doc.data().equipmentStatus,
            }));

            // 加入 displayId 屬性並排序
            const sortedData = data.map((item, index) => ({ ...item, displayId: index + 1 }));
            sortedData.sort((a, b) => a.displayId - b.displayId);

            setEquipments([...sortedData]);
            setIsLoading(false);
        }
        fetchData();
    }, [db, updated]);

    async function addEquipment(equipment: Omit<Equipment, 'id'>) {
        const docRef = await addDoc(collection(db, "equipment"), {
            equipmentName: equipment.equipmentName,
            equipmentStatus: equipment.equipmentStatus
        });
        console.log("Document written with ID: ", docRef.id);
        setUpdated((currentValue) => currentValue + 1);
    }

    async function updateEquipment(equipment: Equipment) {
        try {
            await updateDoc(doc(db, "equipment", equipment.id), {
                equipmentName: equipment.equipmentName,
                equipmentStatus: equipment.equipmentStatus
            });
            setUpdated((currentValue) => currentValue + 1);
        } catch (error) {
            console.error(error);
        }
    }
    async function deleteEquipment(id: string) {
        try {
            const db = getFirestore(app);
            await deleteDoc(doc(db, "equipment", id));
            setUpdated((currentValue) => currentValue + 1)
        }
        catch (error) {
            console.error(error);
        }
    }
    return [equipments, addEquipment, updateEquipment, deleteEquipment, isLoading] as const;
}
