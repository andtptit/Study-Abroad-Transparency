import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, getDocs, query, orderBy, addDoc, doc, deleteDoc, serverTimestamp, where, limit, setDoc, getDoc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
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

// User Authentication
export const loginWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
            await syncUserProfile(result.user);
        }
        return result;
    } catch (error) {
        console.error("Lỗi đăng nhập Google:", error);
        if (error.code === 'auth/unauthorized-domain') {
            alert('Lỗi: Tên miền này chưa được cấp phép đăng nhập. Vui lòng thêm tên miền vào Firebase Console > Authentication > Settings > Authorized domains.');
        } else if (error.code === 'auth/popup-closed-by-user') {
            // User closed the popup, do nothing
            console.log('User closed popup');
        } else {
            alert('Đã xảy ra lỗi khi đăng nhập: ' + error.message);
        }
        return null;
    }
};

export const logoutUser = () => {
    if (!auth) return;
    return signOut(auth);
};

export const checkIsAdmin = async (email) => {
    if (!db || !email) return false;
    try {
        const q = query(collection(db, "admins"), where("email", "==", email), limit(1));
        const snapshot = await getDocs(q);
        return !snapshot.empty;
    } catch(err) {
        console.error("Error checking admin status:", err);
        return false;
    }
};

// Evaluations
export const saveUserEvaluation = async (data, userProfile = null) => {
    if (!db) return;
    try {
        let authorData = {
            likesCount: 0,
            likedBy: []
        };
        
        if (userProfile) {
            authorData = {
                ...authorData,
                userDisplayName: userProfile.displayName || 'Ẩn danh',
                userPhotoURL: userProfile.photoURL || '',
                userLevel: calculateUserLevel(userProfile.evaluationsCount + 1, userProfile.likesReceived)
            };
            
            // Tăng số đếm bài viết
            await updateDoc(doc(db, 'users', userProfile.uid), {
                evaluationsCount: increment(1)
            });
        }

        const docRef = await addDoc(collection(db, "evaluations"), {
            ...data,
            ...authorData,
            createdAt: serverTimestamp()
        });
        console.log("Evaluation saved successfully.");
        return docRef.id;
    } catch(err) {
        console.error("Error saving evaluation:", err);
        return null;
    }
};

export const updateEvaluationAuthor = async (evalId, userProfile) => {
    if (!db || !evalId || !userProfile) return;
    try {
        const authorData = {
            isAnonymous: false,
            userId: userProfile.uid,
            userDisplayName: userProfile.displayName || 'Ẩn danh',
            userPhotoURL: userProfile.photoURL || '',
            userLevel: calculateUserLevel(userProfile.evaluationsCount + 1, userProfile.likesReceived)
        };
        await updateDoc(doc(db, "evaluations", evalId), authorData);
        
        await updateDoc(doc(db, 'users', userProfile.uid), {
            evaluationsCount: increment(1)
        });
    } catch(err) {
        console.error("Error updating evaluation author:", err);
    }
};

export const fetchEvaluations = async (limitCount = null) => {
    if (!db) return [];
    try {
        let q = query(collection(db, "evaluations"), orderBy("createdAt", "desc"));
        if (limitCount) {
            q = query(collection(db, "evaluations"), orderBy("createdAt", "desc"), limit(limitCount));
        }
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch(err) {
        console.error("Error fetching evaluations:", err);
        return [];
    }
};

// Centers Management (Admin & User Select)
export const fetchCenters = async () => {
    if (!db) return [];
    try {
        const q = query(collection(db, "centers"), orderBy("name", "asc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch(err) {
        console.error("Error fetching centers:", err);
        return [];
    }
};

export const addCenter = async (name) => {
    if (!db) return null;
    try {
        const docRef = await addDoc(collection(db, "centers"), {
            name: name,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch(err) {
        console.error("Error adding center:", err);
        return null;
    }
};

export const deleteCenter = async (id) => {
    if (!db) return;
    try {
        await deleteDoc(doc(db, "centers", id));
    } catch(err) {
        console.error("Error deleting center:", err);
    }
};

// Gamification (Local Guide)
export const calculateUserLevel = (evalsCount = 0, likesCount = 0) => {
    if (evalsCount >= 10 || likesCount >= 50) return { id: 'expert', name: 'Chuyên Gia', icon: '💎', color: '#eab308', bg: '#fef08a' };
    if (evalsCount >= 5 || likesCount >= 10) return { id: 'guide', name: 'Thổ Địa', icon: '🥇', color: '#ea580c', bg: '#ffedd5' };
    if (evalsCount >= 2) return { id: 'contributor', name: 'Người Đóng Góp', icon: '🥈', color: '#0284c7', bg: '#e0f2fe' };
    return { id: 'newbie', name: 'Tân Binh', icon: '🌱', color: '#16a34a', bg: '#dcfce3' };
};

export const syncUserProfile = async (user) => {
    if (!db || !user) return;
    try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                displayName: user.displayName || user.email?.split('@')[0],
                photoURL: user.photoURL || '',
                evaluationsCount: 0,
                likesReceived: 0,
                createdAt: serverTimestamp()
            });
        } else {
            // Cập nhật Avatar và Tên nếu có thay đổi
            await updateDoc(userRef, {
                displayName: user.displayName || user.email?.split('@')[0],
                photoURL: user.photoURL || ''
            });
        }
    } catch(err) {
        console.error("Error syncing profile:", err);
    }
};

export const getUserProfile = async (uid) => {
    if (!db || !uid) return null;
    try {
        const userSnap = await getDoc(doc(db, 'users', uid));
        if (userSnap.exists()) {
            const data = userSnap.data();
            return { ...data, level: calculateUserLevel(data.evaluationsCount, data.likesReceived) };
        }
        return null;
    } catch(err) {
        return null;
    }
};

export const toggleLikeEvaluation = async (evalId, userId, isLiking) => {
    if (!db || !userId) return;
    try {
        const evalRef = doc(db, 'evaluations', evalId);
        const evalSnap = await getDoc(evalRef);
        if (!evalSnap.exists()) return;
        
        const evalData = evalSnap.data();
        const authorId = evalData.userId;

        if (isLiking) {
            await updateDoc(evalRef, {
                likedBy: arrayUnion(userId),
                likesCount: increment(1)
            });
            if (authorId) {
                await updateDoc(doc(db, 'users', authorId), {
                    likesReceived: increment(1)
                });
            }
        } else {
            await updateDoc(evalRef, {
                likedBy: arrayRemove(userId),
                likesCount: increment(-1)
            });
            if (authorId) {
                await updateDoc(doc(db, 'users', authorId), {
                    likesReceived: increment(-1)
                });
            }
        }
    } catch (err) {
        console.error("Error toggling like:", err);
    }
};

// Comments
export const addEvaluationComment = async (evalId, userProfile, content) => {
    if (!db || !evalId || !userProfile || !content.trim()) return null;
    try {
        const commentsRef = collection(db, "evaluations", evalId, "comments");
        const docRef = await addDoc(commentsRef, {
            userId: userProfile.uid,
            userDisplayName: userProfile.displayName || 'Ẩn danh',
            userPhotoURL: userProfile.photoURL || '',
            content: content.trim(),
            createdAt: serverTimestamp()
        });
        
        // Cập nhật số lượng comment trong bài đánh giá gốc
        const evalRef = doc(db, "evaluations", evalId);
        await updateDoc(evalRef, {
            commentsCount: increment(1)
        });

        return docRef.id;
    } catch(err) {
        console.error("Error adding comment:", err);
        return null;
    }
};

export const fetchEvaluationComments = async (evalId) => {
    if (!db || !evalId) return [];
    try {
        const commentsRef = collection(db, "evaluations", evalId, "comments");
        const q = query(commentsRef, orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);
        const comments = [];
        snapshot.forEach(doc => {
            comments.push({ id: doc.id, ...doc.data() });
        });
        return comments;
    } catch(err) {
        console.error("Error fetching comments:", err);
        return [];
    }
};

// Admin Settings & Controls
export const fetchGeneralSettings = async () => {
    if (!db) return { minLikesForQuality: 20 };
    try {
        const snap = await getDoc(doc(db, 'settings', 'general'));
        if (snap.exists()) {
            return { minLikesForQuality: 20, ...snap.data() };
        }
        return { minLikesForQuality: 20 };
    } catch (err) {
        return { minLikesForQuality: 20 };
    }
};

export const updateGeneralSettings = async (settings) => {
    if (!db) return;
    try {
        await setDoc(doc(db, 'settings', 'general'), settings, { merge: true });
    } catch(err) {
        console.error("Error updating settings:", err);
    }
};

export const toggleAdminVerify = async (evalId, isVerified) => {
    if (!db || !evalId) return;
    try {
        await updateDoc(doc(db, "evaluations", evalId), {
            isAdminVerified: isVerified
        });
    } catch(err) {
        console.error("Error toggling verify:", err);
    }
};

export const updateEvaluationCenterName = async (evalId, newName) => {
    if (!db || !evalId || !newName) return;
    try {
        await updateDoc(doc(db, "evaluations", evalId), {
            centerName: newName
        });
    } catch(err) {
        console.error("Error updating single center name:", err);
    }
};

export const bulkUpdateCenterName = async (oldName, newName) => {
    if (!db || !oldName || !newName) return 0;
    try {
        let count = 0;
        // 1. Update evaluations
        const q = query(collection(db, "evaluations"), where("centerName", "==", oldName));
        const querySnapshot = await getDocs(q);
        
        for (const document of querySnapshot.docs) {
            await updateDoc(doc(db, "evaluations", document.id), {
                centerName: newName
            });
            count++;
        }

        // 2. Check if newName exists in centers collection, if not add it
        if (count > 0) {
            const qCenters = query(collection(db, "centers"), where("name", "==", newName));
            const centersSnap = await getDocs(qCenters);
            if (centersSnap.empty) {
                await addDoc(collection(db, "centers"), {
                    name: newName,
                    createdAt: serverTimestamp()
                });
            }
        }
        
        return count;
    } catch(err) {
        console.error("Error bulk updating center name:", err);
        return -1;
    }
};
