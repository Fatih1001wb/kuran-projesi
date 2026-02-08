import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const progressCollection = (uid) => collection(db, "users", uid, "progress");
const progressDoc = (uid, sureId) =>
  doc(db, "users", uid, "progress", String(sureId));

export const getSurahProgress = async (uid, sureId) => {
  if (!db || !uid || !sureId) return null;
  const snapshot = await getDoc(progressDoc(uid, sureId));
  return snapshot.exists() ? snapshot.data() : null;
};

export const setSurahProgress = async (uid, payload) => {
  if (!db || !uid || !payload?.sureId) return;
  const data = {
    ...payload,
    updatedAt: serverTimestamp(),
  };
  await setDoc(progressDoc(uid, payload.sureId), data, { merge: true });
};

export const getUserProgressMap = async (uid) => {
  if (!db || !uid) return {};
  const snapshot = await getDocs(progressCollection(uid));
  const map = {};
  snapshot.forEach((docSnap) => {
    map[docSnap.id] = docSnap.data();
  });
  return map;
};

export const getUserProgressList = async (uid, limitCount = 3) => {
  if (!db || !uid) return [];
  const progressQuery = query(
    progressCollection(uid),
    orderBy("updatedAt", "desc"),
    limit(limitCount),
  );
  const snapshot = await getDocs(progressQuery);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};
