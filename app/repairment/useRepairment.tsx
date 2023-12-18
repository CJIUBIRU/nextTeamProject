import { addDoc, updateDoc, deleteDoc, doc, Timestamp, collection, getDocs, getFirestore, limit, orderBy, query, where, and, setDoc } from "firebase/firestore";
import app from "@/app/_firebase/Config"
import { useEffect, useState } from "react";
import { Period } from "../_settings/interfaces";
import React from "react";
import { format } from "date-fns";
import { Repair } from "../_settings/interfaces";

function useRepairment() { // equipmentId: string[]
    const [newDate, setnewDate] = React.useState(new Date());
    const db = getFirestore(app);
    const [repairment, setRepairment] = useState({
        repairmentId: '',
        equipmentId: [] as string[],
        repairReason: "",
        repairPhoto: "next.svg",
        repairStatus: 0
    });

    type CategoryType = {
        repairTotal: number;
        rentAble: number;
    };

    // console.log("useRepairment", repairment.equipmentId);


    const [repairList, setRepairList] = useState<Repair[]>([])


    // re-render
    const [updated, setUpdated] = useState(0);

    // fecth repair data;
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        async function fetchRepairmentData() {
            setIsLoading(true);
            let data: any[] = [];
            const queryRef = collection(db, "repair");
            const equipmentQuery = query(queryRef, orderBy("equipmentCategory", "desc"));
            const querySnapshotEquipment = await getDocs(equipmentQuery)
            querySnapshotEquipment.forEach((doc) => {
                data.push({
                    id: doc.id,
                    equipmentId: doc.data().equipmentId,
                    repairReason: doc.data().repairReason,
                    repairPhoto: doc.data().repairPhoto,
                    repairStatus: Number(doc.data().repairStatus),
                    equipmentCategory: doc.data().equipmentCategory,
                    submitTime: doc.data().submitTime,
                    doneTime: doc.data().doneTime
                })
            })
            let list2 = data.map(item => ({
                ...item,
                repairStatus: item.repairStatus === 1 ? '完成修理' : '報修中'
            }));

            setRepairList(() => [...list2]);

            setIsLoading(false);
        }
        fetchRepairmentData();
    }, [db, updated]);

    // add new repair data
    const [isAddLoading, setAddIsLoading] = useState(false);
    async function addRepair(repair: {
        repairmentId: string,
        equipmentId: string[],
        repairReason: string,
        repairPhoto: string,
        repairStatus: number,
        equipmentCategory: string,
        submitTime: string,
        doneTime: string,
    }) {
        // console.log("add", repairment.equipmentId);
        // alert('add2')
        setAddIsLoading(true);
        const docRef = await setDoc(doc(db, "repair", repair.repairmentId),
            {
                equipmentId: repair.equipmentId,
                repairReason: repair.repairReason,
                repairPhoto: repair.repairPhoto,
                repairStatus: Number(repair.repairStatus),
                equipmentCategory: repair.equipmentCategory,
                submitTime: repair.submitTime,
                doneTime: repair.doneTime,
            }
        );
        setUpdated((currentValue) => currentValue + 1)
        setAddIsLoading(false);
    }

    // update equipment status
    async function updateEquipment(equipmentId: any) {
        try {
            equipmentId.forEach(async (row: any) => {
                await updateDoc(doc(db, "equipment", row),
                    { equipmentStatus: 2 });
            }, { merge: true });
            setUpdated((currentValue) => currentValue + 1)
        }
        catch (error) {
            console.error(error);
        }
    }

    // update category amount
    async function updateCategory(equipmentId: any, equipmentCategory: any) {
        try {
            // 計算器材數量
            const equipmentCount = equipmentId.length;

            // 查詢對應類別的文檔
            const categoryQuery = query(collection(db, "category"), where("categoryName", "==", equipmentCategory));
            const categoryDocs = await getDocs(categoryQuery);

            // 如果找到對應的類別文檔
            if (categoryDocs.size > 0) {
                const categoryDoc = categoryDocs.docs[0];
                const categoryId = categoryDoc.id;

                // 更新類別的 repairTotal 和 rentAble
                await updateDoc(doc(db, "category", categoryId), {
                    repairTotal: (categoryDoc.data().repairTotal || 0) + equipmentCount,
                    rentAble: (categoryDoc.data().rentAble || 0) - equipmentCount,
                }); // 使用 merge: true 以僅更新指定的欄位
            }
        } catch (error) {
            console.error(error);
        }
    }

    // edit repair list
    async function editRepairList(editRepair: any) {
        // update repairReason, repairPhoto, submitTime
        const submitTime = `${format(newDate, "M/d/yyyy")} ${Timestamp.fromDate(new Date()).toDate().toTimeString().slice(0, 5)}`
        await updateDoc(doc(db, "repair", editRepair.id), {
            repairReason: editRepair.repairReason,
            repairPhoto: editRepair.repairPhoto,
            submitTime: submitTime
        });

        setUpdated((currentValue) => currentValue + 1)
    }


    // delete repair data
    async function updateRepair(row: any, updateRepairStatusVisible: boolean) {
        try {
            // update category amount
            // 計算器材數量
            const equipmentCount = row.equipmentId.length;
            // 查詢對應類別的文檔
            const categoryQuery = query(collection(db, "category"), where("categoryName", "==", row.equipmentCategory));
            const categoryDocs = await getDocs(categoryQuery);
            // 如果找到對應的類別文檔
            if (categoryDocs.size > 0) {
                const categoryDoc = categoryDocs.docs[0];
                const categoryId = categoryDoc.id;

                // 更新類別的 repairTotal 和 rentAble
                await updateDoc(doc(db, "category", categoryId), {
                    repairTotal: (categoryDoc.data().repairTotal || 0) - equipmentCount,
                    rentAble: (categoryDoc.data().rentAble || 0) + equipmentCount,
                });
            }

            //  update equipment status
            row.equipmentId.forEach(async (id: any) => {
                await updateDoc(doc(db, "equipment", id),
                    { equipmentStatus: 1 });
            }, { merge: true });


            // update repair status & doneTime
            if (updateRepairStatusVisible) {
                const doneTime = `${format(newDate, "M/d/yyyy")} ${Timestamp.fromDate(new Date()).toDate().toTimeString().slice(0, 5)}`
                await updateDoc(doc(db, "repair", row.id), {
                    repairStatus: 1,
                    doneTime: doneTime,
                });
            }
            else {
                const docRef = doc(db, 'repair', row.id);
                await deleteDoc(docRef);
            }



            setUpdated((currentValue) => currentValue + 1)
        } catch (error) {
            console.error(error);
        }
    }

    return [repairment, setRepairment, isLoading, repairList, addRepair, isAddLoading, updateEquipment, updateCategory, updateRepair, editRepairList] as const;
}

export default useRepairment;