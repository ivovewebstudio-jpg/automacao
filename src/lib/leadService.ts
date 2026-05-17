import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from './firebase';

export interface LeadData {
  name: string;
  email: string;
  source: string;
  tags?: string[];
}

export const LeadService = {
  async captureLead(data: LeadData) {
    const user = auth.currentUser;
    if (!user) throw new Error("Apenas usuários autenticados podem capturar leads.");

    const path = 'leads';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...data,
        ownerId: user.uid,
        status: 'new',
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async getMyLeads(max: number = 10) {
    const user = auth.currentUser;
    if (!user) return [];

    const path = 'leads';
    try {
      const q = query(
        collection(db, path),
        where("ownerId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(max)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  }
};
