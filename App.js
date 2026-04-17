import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BasicInfoStep from './components/BasicInfoStep';
import SurveyStep from './components/SurveyStep';
import ResultStep from './components/ResultStep';
import { fetchCriteriaData, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import AdminLogin from './components/Admin/Login';
import AdminDashboard from './components/Admin/Dashboard';

export default function App() {
    const [step, setStep] = useState(0);
    const [criteriaData, setCriteriaData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [centerName, setCenterName] = useState('');
    const [price, setPrice] = useState(65); 
    const [answers, setAnswers] = useState({}); 
    const [currentQIndex, setCurrentQIndex] = useState(0);

    // Admin Routing & Auth State
    const [isAdminRoute, setIsAdminRoute] = useState(window.location.hash === '#/admin');
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

    useEffect(() => {
        const handleHashChange = () => setIsAdminRoute(window.location.hash === '#/admin');
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    useEffect(() => {
        if (!auth) return;
        const unsubscribe = onAuthStateChanged(auth, user => {
            setIsAdminLoggedIn(!!user);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (isAdminRoute) return; // Không cần tải Data Survey nếu vào admin
        const loadData = async () => {
            setIsLoading(true);
            const data = await fetchCriteriaData();
            setCriteriaData(data);
            setIsLoading(false);
        };
        loadData();
    }, [isAdminRoute]);

    const handleStart = () => {
        if (!centerName.trim()) setCenterName('Trung tâm ẩn danh');
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
        if (isAdminLoggedIn) return <AdminDashboard onLogout={() => setIsAdminLoggedIn(false)} />;
        return <AdminLogin onLoginSuccess={() => setIsAdminLoggedIn(true)} />;
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
            <Header step={step} currentQIndex={currentQIndex} totalQuestions={criteriaData.length} />

            <main className={`mx-auto p-4 sm:p-6 lg:p-8 pt-8 sm:pt-12 transition-all duration-500 ${step === 1 ? 'max-w-7xl' : 'max-w-4xl'}`}>
                {step === 0 && (
                    <BasicInfoStep
                        centerName={centerName}
                        setCenterName={setCenterName}
                        price={price}
                        setPrice={setPrice}
                        onStart={handleStart}
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
                    />
                )}
            </main>
        </div>
    );
}