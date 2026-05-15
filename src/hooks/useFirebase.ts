import { useEffect, useState } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';

export function useFirestoreCollection<T>(collectionPath: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionPath));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setData(items);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
      handleFirestoreError(err, OperationType.LIST, collectionPath);
    });

    return () => unsubscribe();
  }, [collectionPath]);

  const addItem = async (item: any) => {
    try {
      const docId = item.id || item.pnr;
      if (docId) {
        // Use provided ID as doc ID
        const { id, pnr, ...rest } = item;
        // Keep the identifier in the data if it's pnr
        const data = item.pnr ? { pnr, ...rest } : rest;
        await setDoc(doc(db, collectionPath, docId), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, collectionPath), {
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, collectionPath);
    }
  };

  const updateItem = async (itemId: string, updates: any) => {
    try {
      await updateDoc(doc(db, collectionPath, itemId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${collectionPath}/${itemId}`);
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      await deleteDoc(doc(db, collectionPath, itemId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${collectionPath}/${itemId}`);
    }
  };

  return { data, loading, error, addItem, updateItem, deleteItem };
}
