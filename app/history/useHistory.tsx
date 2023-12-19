import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import app from "../_firebase/Config";
import { useEffect, useState } from "react";
import { Product } from "../_settings/interfaces";

function useProducts() {
  const db = getFirestore(app);
  const [updated, setUpdated] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);

  async function fetchData() {
    setIsLoading(true);
    let data: Product[] = [];
    const productRef = collection(db, "schedule");
    const productQuery = query(productRef, orderBy("date", "desc"));
    const querySnapshot = await getDocs(productQuery);

    querySnapshot.forEach((doc) => {
      data.push({
        id: doc.data().id,
        userId: doc.data().userId,
        userName: doc.data().userName,
        date: doc.data().date,
        period: doc.data().period,
        rentTime: doc.data().rentTime,
        returnTime: doc.data().returnTime,
        equipmentCategory: doc.data().equipmentCategory,
        equipmentQuantity: doc.data().equipmentQuantity,
      });
      console.log(`${doc.id} => ${doc.data()}`);
    });
    setProducts(() => [...data]);
    setIsLoading(false);
  }
  // fecthData();
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      let data: Product[] = [];
      // let data: { rid: string, user: string, equipmentId: string, equipmentName: string, equipmentQuantity: number, rentTime: string, returnTime: string, status: string }[] = [];
      // const querySnapshot = await getDocs(collection(db, "record"));
      const productRef = collection(db, "schedule");
      const productQuery = query(productRef, orderBy("date", "desc"));
      const querySnapshot = await getDocs(productQuery);

      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          userId: doc.data().userId,
          userName: doc.data().userName,
          date: doc.data().date,
          period: doc.data().period,
          rentTime: doc.data().rentTime,
          returnTime: doc.data().returnTime,
          equipmentCategory: doc.data().equipmentCategory,
          equipmentQuantity: doc.data().equipmentQuantity,
        });
        // console.log(`${doc.id} => ${doc.data()}`);
      });
      let list2 = data.map(item => ({
        ...item,
        returnTime: item.returnTime === "" ? "未歸還" : item.returnTime
      }))
      setProducts(() => [...list2]);
      setIsLoading(false);
    }
    fetchData();
  }, [db, updated]);

  async function addProduct(product: Product) {
    const db = getFirestore(app);
    const docRef = await addDoc(collection(db, "schedule"), {
      id: product.id,
      userId: product.userId,
      userName: product.userName,
      date: product.date,
      period: product.period,
      rentTime: product.rentTime,
      returnTime: product.returnTime,
      equipmentCategory: product.equipmentCategory,
      equipmentQuantity: product.equipmentQuantity,
    });
    console.log("Document written with ID: ", docRef.id);
    setUpdated((currentValue) => currentValue + 1);
  }

  async function deleteProduct(id: string) {
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, "schedule", id));
      setUpdated((currentValue) => currentValue + 1);
    } catch (error) {
      console.error(error);
    }
  }

  async function updateProduct(product: Product) {
    try {
      const db = getFirestore(app);
      await updateDoc(doc(db, "schedule", product.id), {
        id: product.id,
        userId: product.userId,
        userName: product.userName,
        date: product.date,
        period: product.period,
        rentTime: product.rentTime,
        returnTime: product.returnTime,
        equipmentCategory: product.equipmentCategory,
        equipmentQuantity: product.equipmentQuantity,
      });
      setUpdated((currentValue) => currentValue + 1);
    } catch (error) {
      console.error(error);
    }
  }

  return [
    products,
    addProduct,
    deleteProduct,
    updateProduct,
    isLoading,
  ] as const;
}
export default useProducts;
