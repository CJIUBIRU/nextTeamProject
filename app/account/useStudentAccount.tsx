"use client"

import { collection, getDocs, getFirestore, onSnapshot, addDoc, where, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import app from "@/app/_firebase/Config"
import { useEffect, useState } from "react";
import { Account } from "../_settings/interfaces";

function useStudentAccount() {
    const db = getFirestore(app);
    const [studentAccount, setStudentAccount] = useState<Account[]>([])
    const [employeeAccount, setEmployeeAccount] = useState<Account[]>([])
    // console.log(studentAccount);
    // console.log(employeeAccount);

    const [updated, setUpdated] = useState(0);

    // Get student accounts
    useEffect(() => {
        async function fetchStudentData() {
            let data: Account[] = [];
            const docRef = collection(db, "account")
            const docQuery = query(docRef, where("level", "==", 0));
            const querySnapshot = await getDocs(docQuery);
            // const querySnapshot = await getDocs(collection(db, "account"));
            querySnapshot.forEach((doc) => {
                data.push({ docId: doc.id, id: doc.data().id, level: doc.data().level, name: doc.data().name });
            });
            setStudentAccount(() => [...data]);
        }
        // async function fetchEmployeeData() {
        //     let data2: Account[] = [];
        //     const docRef2 = collection(db, "account")
        //     const docQuery2 = query(docRef2, where("level", "==", 1));
        //     const querySnapshot2 = await getDocs(docQuery2);
        //     // const querySnapshot = await getDocs(collection(db, "account"));
        //     querySnapshot2.forEach((doc) => {
        //         data2.push({ docId: doc.id, id: doc.data().id, level: doc.data().level, name: doc.data().name });
        //     });
        //     setEmployeeAccount(() => [...data2]);
        // }
        fetchStudentData();
        // fetchEmployeeData();
    }, [db, updated]);

    // Get employee accounts
    useEffect(() => {
        async function fetchEmployeeData() {
            let data: Account[] = [];
            const docRef = collection(db, "account")
            const docQuery = query(docRef, where("level", "==", 1));
            const querySnapshot = await getDocs(docQuery);
            // const querySnapshot = await getDocs(collection(db, "account"));
            querySnapshot.forEach((doc) => {
                data.push({ docId: doc.id, id: doc.data().id, level: doc.data().level, name: doc.data().name });
            });
            setEmployeeAccount(() => [...data]);
        }
        fetchEmployeeData();
    }, [db, updated]);

    // Add a new account
    async function addAccount(account: { id: number, name: string, level: number }) {
        const docRef = await addDoc(collection(db, "account"),
            { id: Number(account.id), name: account.name, level: account.level });
        console.log("Document written with ID: ", docRef.id);
        setUpdated((currentValue) => currentValue + 1)
    }

    // Delete accounts
    async function deleteAccount(selectedRows: any) {
        try {
            selectedRows.forEach(async (row: any) => {
                const docRef = doc(db, 'account', row.docId);
                await deleteDoc(docRef);
            });
            setUpdated((currentValue) => currentValue + 1)
        }
        catch (error) {
            console.error(error);
        }
    }

    // Update a account
    async function updateAccount(account: Account) {
        await updateDoc(doc(db, "account", account.docId),
            { id: account.id, name: account.name });
        setUpdated((currentValue) => currentValue + 1)
    }

    return [studentAccount, addAccount, deleteAccount, updateAccount] as const;

}

export default useStudentAccount;