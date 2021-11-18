import firebaseConfig from "../config/firebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";
export { signInWithPopup, signOut } from "firebase/auth";
export {
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  doc,
  collection,
  onSnapshot,
  writeBatch,
  query,
  where,
  limit,
  orderBy,
  Timestamp,
  collectionGroup,
  serverTimestamp,
  startAfter,
  updateDoc,
  increment,
} from "firebase/firestore";

export { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  doc,
  collection,
  query,
  where,
  limit,
  onSnapshot,
  writeBatch,
} from "firebase/firestore";

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

export async function getUserWithUsername(username) {
  const usersRef = collection(firestore, "users");
  const queryRes = query(usersRef, where("username", "==", username), limit(1));
  const userDocs = await getDocs(queryRes);
  return userDocs;
}

export function postToJSON(document) {
  const data = document.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}

export default firebaseApp;
