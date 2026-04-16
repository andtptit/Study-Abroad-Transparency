import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { CRITERIA_FALLBACK } from './data/criteria';

const firebaseConfig = {
  apiKey: "AIzaSyBVpBXwUn3GVcXDuu7R8hJpifjjL5R5U2I",
  authDomain: "minhbachduhoc.firebaseapp.com",
  projectId: "minhbachduhoc",
  storageBucket: "minhbachduhoc.firebasestorage.app",
  messagingSenderId: "52539314779",
  appId: "1:52539314779:web:82d952e362eda0c96b657e",
  measurementId: "G-CTJYNN56B6"
};

let db = null;
let auth = null;
try {
   const app = initializeApp(firebaseConfig);
   if (typeof window !== "undefined") {
       getAnalytics(app);
   }
   db = getFirestore(app);
   auth = getAuth(app);
} catch(e) {
   console.warn("Firebase not properly configured yet.", e);
}

export { db, auth };
export const loginAdmin = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logoutAdmin = () => signOut(auth);
export const fetchCriteriaData = async () => {
    if (!db) return CRITERIA_FALLBACK;
    try {
        const q = query(collection(db, "radar_criteria"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            console.log("Firestore empty, using fallback!");
            return CRITERIA_FALLBACK;
        }
        
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ ...doc.data() });
        });
        
        return data.length > 0 ? data : CRITERIA_FALLBACK;
    } catch(err) {
        console.error("Error fetching criteria from Firebase:", err);
        return CRITERIA_FALLBACK;
    }
}
