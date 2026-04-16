import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { CRITERIA_FALLBACK } from './data/criteria.js';

const firebaseConfig = {
  apiKey: "AIzaSyBVpBXwUn3GVcXDuu7R8hJpifjjL5R5U2I",
  authDomain: "minhbachduhoc.firebaseapp.com",
  projectId: "minhbachduhoc",
  storageBucket: "minhbachduhoc.firebasestorage.app",
  messagingSenderId: "52539314779",
  appId: "1:52539314779:web:82d952e362eda0c96b657e",
  measurementId: "G-CTJYNN56B6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function pushData() {
    console.log("Bắt đầu đồng bộ 15 tiêu chí lên Firebase Firestore...");
    try {
        for (let i = 0; i < CRITERIA_FALLBACK.length; i++) {
            const criterion = CRITERIA_FALLBACK[i];
            const criterionWithOrder = { ...criterion, order: i + 1 };
            
            await setDoc(doc(db, "radar_criteria", criterion.id), criterionWithOrder);
            console.log(`- Đã tải lên thành công: ${criterion.id}`);
        }
        console.log("✅ Đồng bộ toàn bộ dữ liệu mẫu lên Firestore thành công!");
        process.exit(0);
    } catch(e) {
        console.error("Lỗi đồng bộ: ", e);
        process.exit(1);
    }
}

pushData();
