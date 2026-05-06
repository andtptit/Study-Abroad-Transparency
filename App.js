import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BasicInfoStep from './components/BasicInfoStep';
import SurveyStep from './components/SurveyStep';
import ResultStep from './components/ResultStep';
import CommunityFeed from './components/CommunityFeed';
import { fetchCriteriaData, auth, loginWithGoogle, logoutUser, fetchCenters, checkIsAdmin } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import AdminLogin from './components/Admin/Login';
import AdminDashboard from './components/Admin/Dashboard';

export default function App() {
    const [step, setStep] = useState(0);
    const [criteriaData, setCriteriaData] = useState([]);
    const [centersList, setCentersList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [centerName, setCenterName] = useState('');
    const [price, setPrice] = useState(65); 
    const [answers, setAnswers] = useState({}); 
    const [currentQIndex, setCurrentQIndex] = useState(0);

    // Routing & Auth State
    const [isAdminRoute, setIsAdminRoute] = useState(window.location.hash === '#/admin');
    const [isFeedRoute, setIsFeedRoute] = useState(window.location.hash === '#/feed');
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const handleHashChange = () => {
            setIsAdminRoute(window.location.hash === '#/admin');
            setIsFeedRoute(window.location.hash === '#/feed');
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        if (!auth) {
            setIsCheckingAuth(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const { getUserProfile } = await import('./firebase');
                let profile = await getUserProfile(user.uid);
                
                // Fallback nếu syncUserProfile chưa chạy kịp (Race condition)
                if (!profile) {
                    profile = {
                        uid: user.uid,
                        displayName: user.displayName || user.email?.split('@')[0],
                        photoURL: user.photoURL || '',
                        evaluationsCount: 0,
                        likesReceived: 0,
                        level: { id: 'newbie', name: 'Tân Binh', icon: '🌱', color: '#16a34a', bg: '#dcfce3' }
                    };
                }

                setCurrentUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    profile: profile
                });
                
                if (user.email) {
                    const isAdmin = await checkIsAdmin(user.email);
                    setIsAdminLoggedIn(isAdmin);
                } else {
                    setIsAdminLoggedIn(false);
                }
            } else {
                setCurrentUser(null);
                setIsAdminLoggedIn(false);
            }
            setIsCheckingAuth(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (isAdminRoute) return; // Không cần tải Data Survey nếu vào admin
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [data, centers] = await Promise.all([
                    fetchCriteriaData(),
                    fetchCenters()
                ]);
                setCriteriaData(data);
                setCentersList(centers);
            } catch (err) {
                console.error("Error loading initial data:", err);
            }
            setIsLoading(false);
        };
        loadData();
    }, [isAdminRoute]);

    const handleStart = () => {
        if (!centerName.trim()) {
            alert('Vui lòng chọn hoặc nhập tên trung tâm!');
            return;
        }
        setStep(1); 
    };

    const handleSelectAnswer = (stars) => {
        const currentQId = criteriaData[currentQIndex].id;
        setAnswers({ ...answers, [currentQId]: stars });
    };

    const handleNextQuestion = () => {
        if (currentQIndex < criteriaData.length - 1) {
            setCurrentQIndex(currentQIndex + 1);
        } else {
            setStep(2);
        }
    };

    const handleBackQuestion = () => {
        if (currentQIndex > 0) setCurrentQIndex(currentQIndex - 1);
        else setStep(0);
    };

    const handleReset = () => {
        setStep(0);
        setCenterName('');
        setPrice(65);
        setAnswers({});
        setCurrentQIndex(0);
    };

    const handleUpdateAnswer = (criterionId, stars) => {
        setAnswers(prev => ({ ...prev, [criterionId]: stars }));
    };

    if (isAdminRoute) {
        if (isCheckingAuth) {
            return (
                <div className="min-h-screen bg-slate-50 flex flex-col gap-4 items-center justify-center font-sans">
                    <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-500 rounded-full animate-spin"></div>
                    <span className="font-bold text-slate-500">Đang kiểm tra quyền...</span>
                </div>
            );
        }
        if (!isAdminLoggedIn) return <AdminLogin onLogin={loginWithGoogle} user={currentUser} onLogout={logoutUser} />;
        return <AdminDashboard onLogout={logoutUser} />;
    }

    if (isFeedRoute) {
        return (
            <CommunityFeed 
                user={currentUser}
                onLogin={loginWithGoogle}
                onBack={() => window.location.hash = '#/'}
                centersList={centersList}
                criteriaData={criteriaData}
            />
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col gap-4 items-center justify-center font-sans">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="font-bold text-slate-500">Đang khởi tạo cấu hình...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100">
            <Header 
                step={step} 
                currentQIndex={currentQIndex} 
                totalQuestions={criteriaData.length}
                user={currentUser}
                onLogin={loginWithGoogle}
                onLogout={logoutUser}
                onOpenHistory={() => window.location.hash = '#/feed'}
            />

            <main className={`mx-auto p-4 sm:p-6 lg:p-8 pt-8 sm:pt-12 transition-all duration-500 ${step === 1 ? 'max-w-7xl' : 'max-w-6xl'}`}>
                {step === 0 && (
                    <BasicInfoStep
                        centerName={centerName}
                        setCenterName={setCenterName}
                        price={price}
                        setPrice={setPrice}
                        onStart={handleStart}
                        centersList={centersList}
                    />
                )}

                {step === 1 && (
                    <SurveyStep
                        currentQIndex={currentQIndex}
                        answers={answers}
                        onSelectAnswer={handleSelectAnswer}
                        onNext={handleNextQuestion}
                        onBack={handleBackQuestion}
                        criteriaData={criteriaData}
                    />
                )}

                {step === 2 && (
                    <ResultStep
                        centerName={centerName}
                        price={price}
                        answers={answers}
                        onReset={handleReset}
                        onUpdateAnswer={handleUpdateAnswer}
                        criteriaData={criteriaData}
                        user={currentUser}
                    />
                )}
            </main>
        </div>
    );
}