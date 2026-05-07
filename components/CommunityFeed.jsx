import React, { useState, useEffect, useMemo } from 'react';
import { Star, History, Lock, Search, Filter, ShieldCheck, Maximize2, Scale, MessageCircle } from 'lucide-react';
import { fetchEvaluations, toggleLikeEvaluation, fetchGeneralSettings } from '../firebase';
import EvaluationModal from './EvaluationModal';
import CompareModal from './CompareModal';

export default function CommunityFeed({ user, onLogin, onBack, centersList, criteriaData }) {
    const [evaluations, setEvaluations] = useState([]);
    const [settings, setSettings] = useState({ minLikesForQuality: 20 });
    const [isLoading, setIsLoading] = useState(true);
    
    // Filters
    const [selectedCenter, setSelectedCenter] = useState('');
    const [qualityFilter, setQualityFilter] = useState(false);

    // Features
    const [selectedEval, setSelectedEval] = useState(null);
    const [compareList, setCompareList] = useState([]);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

    // Xử lý cập nhật comment count ở local
    const handleCommentAdded = (evalId) => {
        setEvaluations(prev => prev.map(ev => 
            ev.id === evalId ? { ...ev, commentsCount: (ev.commentsCount || 0) + 1 } : ev
        ));
    };

    useEffect(() => {
        const loadFeed = async () => {
            setIsLoading(true);
            const [data, loadedSettings] = await Promise.all([
                fetchEvaluations(user ? null : 6), // Fetch 6 if not logged in to show blur tease
                fetchGeneralSettings()
            ]);
            setSettings(loadedSettings);
            setEvaluations(data);
            setIsLoading(false);
        };
        loadFeed();
    }, [user]);

    const handleLike = async (evalId, currentLikedBy) => {
        if (!user) {
            alert('Vui lòng đăng nhập để thả tim và ủng hộ người đánh giá nhé!');
            return;
        }
        const isLiking = !currentLikedBy?.includes(user.uid);
        
        setEvaluations(prev => prev.map(ev => {
            if (ev.id === evalId) {
                return {
                    ...ev,
                    likesCount: isLiking ? (ev.likesCount || 0) + 1 : Math.max(0, (ev.likesCount || 0) - 1),
                    likedBy: isLiking ? [...(ev.likedBy || []), user.uid] : (ev.likedBy || []).filter(id => id !== user.uid)
                };
            }
            return ev;
        }));

        await toggleLikeEvaluation(evalId, user.uid, isLiking);
    };

    const renderSegmentBadge = (status, title, color) => {
        return (
            <div className="px-2 py-0.5 rounded-full text-[10px] font-bold border" style={{ backgroundColor: `${color}10`, color: color, borderColor: `${color}30` }}>
                {title}
            </div>
        );
    };

    // Card Colors Mapping
    const getCardStyle = (segment) => {
        if (segment === 'premium') return 'border-blue-200 bg-blue-50/30 shadow-blue-100/50 hover:shadow-blue-100';
        if (segment === 'value') return 'border-green-200 bg-green-50/30 shadow-green-100/50 hover:shadow-green-100';
        if (segment === 'warning') return 'border-red-200 bg-red-50/30 shadow-red-100/50 hover:shadow-red-100';
        return 'border-amber-200 bg-amber-50/30 shadow-amber-100/50 hover:shadow-amber-100';
    };

    // Lọc dữ liệu
    const filteredEvaluations = useMemo(() => {
        return evaluations.filter(ev => {
            // Lọc theo trung tâm
            if (selectedCenter && ev.centerName !== selectedCenter) return false;
            
            // Lọc theo chất lượng
            if (qualityFilter) {
                const isHighLikes = (ev.likesCount || 0) >= settings.minLikesForQuality;
                if (!ev.isAdminVerified && !isHighLikes) return false;
            }
            return true;
        });
    }, [evaluations, selectedCenter, qualityFilter, settings.minLikesForQuality]);

    const handleToggleCompare = (ev) => {
        setCompareList(prev => {
            const isExist = prev.find(item => item.id === ev.id);
            if (isExist) return prev.filter(item => item.id !== ev.id);
            if (prev.length >= 2) {
                alert('Chỉ có thể so sánh tối đa 2 trung tâm cùng lúc!');
                return prev;
            }
            return [...prev, ev];
        });
    };

    const getSafeScore = (ev) => {
        const rawScore = parseFloat(ev.finalScore);
        if (!isNaN(rawScore) && rawScore !== null) return rawScore;
        
        // Recalculate if NaN
        if (!ev.answers || !criteriaData) return 0;
        const totalWeight = criteriaData.reduce((acc, curr) => {
            if (curr.type === 'text') return acc;
            return acc + (curr.weight || 1.0);
        }, 0);
        const totalScore = criteriaData.reduce((acc, curr) => {
            if (curr.type === 'text') return acc;
            const star = typeof ev.answers?.[curr.id] === 'number' ? ev.answers[curr.id] : 0;
            return acc + (star * (curr.weight || 1.0));
        }, 0);
        return totalWeight > 0 ? Number((totalScore / totalWeight).toFixed(2)) : 0;
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pt-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        Cộng đồng <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-xl text-lg">Radar</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Tham khảo các đánh giá khách quan nhất từ những du học sinh thực tế.</p>
                </div>
                <button onClick={onBack} className="text-sm font-bold text-slate-500 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-200 px-4 py-2 rounded-full transition-all shadow-sm">
                    ← Về trang chủ
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 w-full relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select 
                        value={selectedCenter}
                        onChange={(e) => setSelectedCenter(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-200 pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-700 appearance-none cursor-pointer"
                    >
                        <option value="">Tất cả trung tâm</option>
                        {centersList.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                </div>
                
                <button 
                    onClick={() => setQualityFilter(!qualityFilter)}
                    className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all border-2 w-full sm:w-auto justify-center ${qualityFilter ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                    <Filter className="w-4 h-4" /> 
                    {qualityFilter ? 'Đang lọc: Bài chất lượng' : 'Lọc bài chất lượng'}
                </button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-40 gap-3 text-slate-400">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <span className="text-sm font-medium">Đang tải dữ liệu...</span>
                </div>
            ) : filteredEvaluations.length === 0 ? (
                <div className="text-center py-20 text-slate-500 font-medium border-2 border-dashed border-slate-200 rounded-3xl bg-white">
                    <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    Không tìm thấy lượt đánh giá nào phù hợp.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                    {filteredEvaluations.map((ev, index) => {
                        const isTease = !user && index >= 4;
                        const cardStyle = getCardStyle(ev.segment);
                        
                        return (
                        <div key={ev.id} className={`p-5 rounded-3xl border-2 shadow-sm transition-all relative overflow-hidden group ${cardStyle} ${isTease ? 'blur-[3px] opacity-60 pointer-events-none select-none grayscale-[50%]' : 'hover:-translate-y-1 hover:shadow-md'}`}>
                            
                            {/* Prominent Verified Badge */}
                            {ev.isAdminVerified && (
                                <div className="absolute right-0 top-0 bg-blue-500 text-white rounded-bl-2xl px-3 py-2 shadow-sm group/verify cursor-help z-20 flex items-center gap-1.5">
                                    <ShieldCheck className="w-5 h-5" />
                                    <div className="absolute right-0 top-11 w-48 p-2.5 bg-slate-900 text-white text-xs rounded-xl opacity-0 invisible group-hover/verify:opacity-100 group-hover/verify:visible transition-all shadow-xl font-medium text-center pointer-events-none border border-slate-700">
                                        Đánh giá này đã được xác thực bởi Admin
                                        <div className="absolute -top-2 right-4 w-4 h-4 bg-slate-900 rotate-45 border-l border-t border-slate-700"></div>
                                    </div>
                                </div>
                            )}

                            {/* User Info Header */}
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="flex items-center gap-3">
                                    {ev.userPhotoURL ? (
                                        <img src={ev.userPhotoURL} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover bg-white" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-white text-slate-500 flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
                                            {ev.userDisplayName ? ev.userDisplayName[0].toUpperCase() : 'U'}
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-bold text-slate-800 text-sm leading-tight flex items-center gap-1.5">
                                            {ev.userDisplayName || 'Người dùng ẩn danh'}
                                            {ev.isAdminVerified && (
                                                <span title="Đã được Admin xác nhận" className="bg-blue-100 text-blue-600 rounded-full p-0.5"><ShieldCheck className="w-3 h-3" /></span>
                                            )}
                                        </div>
                                        {ev.userLevel ? (
                                            <span 
                                                className="text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 mt-1 w-max border bg-white/50"
                                                style={{ color: ev.userLevel.color, borderColor: `${ev.userLevel.color}30` }}
                                            >
                                                <span>{ev.userLevel.icon}</span> {ev.userLevel.name}
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-slate-400 font-medium mt-1 block">Thành viên ẩn danh</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Evaluation Body */}
                            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl mb-4 border border-white/50 relative z-10 shadow-sm">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-slate-800 text-base leading-tight pr-2 flex items-center gap-2">
                                        🏫 {ev.centerName || 'Trung tâm ẩn danh'}
                                    </h3>
                                    <div className="flex items-center gap-1 bg-white px-2 py-1.5 rounded-lg shrink-0 border border-amber-100 shadow-sm">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <span className="font-bold text-amber-700 text-sm">{getSafeScore(ev)}</span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 items-center">
                                    {renderSegmentBadge(ev.segment, ev.segment === 'premium' ? 'Cao cấp' : ev.segment === 'value' ? 'Thông minh' : ev.segment === 'warning' ? 'Rủi ro' : 'Phổ thông', ev.segment === 'premium' ? '#3b82f6' : ev.segment === 'value' ? '#22c55e' : ev.segment === 'warning' ? '#ef4444' : '#f59e0b')}
                                    <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200/60 px-2.5 py-0.5 rounded-full shadow-sm">
                                        {ev.price}tr VNĐ
                                    </span>
                                </div>
                            </div>

                            {/* Footer: Date & Actions */}
                            <div className="flex justify-between items-center text-xs text-slate-500 mt-2 pt-4 border-t border-black/5 relative z-10">
                                <span className="font-medium">{ev.createdAt ? new Date(ev.createdAt.seconds * 1000).toLocaleDateString('vi-VN') : 'Vừa xong'}</span>
                                
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => setSelectedEval(ev)}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-full font-bold transition-all text-slate-500 hover:bg-slate-50 ring-1 ring-slate-200/60 bg-white shadow-sm"
                                    >
                                        <MessageCircle className="w-4 h-4 stroke-[2.5]" />
                                        {ev.commentsCount || 0}
                                    </button>

                                    <button 
                                        onClick={() => handleLike(ev.id, ev.likedBy)}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-sm ${ev.likedBy?.includes(user?.uid) ? 'bg-red-50 text-red-600 ring-1 ring-red-200' : 'bg-white text-slate-500 hover:bg-slate-50 ring-1 ring-slate-200/60'}`}
                                    >
                                        <svg className={`w-4 h-4 ${ev.likedBy?.includes(user?.uid) ? 'fill-red-500 stroke-red-500' : 'fill-transparent stroke-current stroke-[2.5]'}`} viewBox="0 0 24 24">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                        </svg>
                                        {ev.likesCount || 0}
                                    </button>
                                </div>
                            </div>

                            {/* Card Actions (Details & Compare) */}
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-black/5 relative z-10">
                                <button 
                                    onClick={() => setSelectedEval(ev)}
                                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold text-sm bg-white/80 hover:bg-white px-4 py-2 rounded-xl transition-colors shadow-sm"
                                >
                                    <Maximize2 className="w-4 h-4" /> Xem chi tiết
                                </button>
                                
                                <button 
                                    onClick={() => handleToggleCompare(ev)}
                                    className={`flex items-center gap-1.5 font-bold text-sm px-4 py-2 rounded-xl transition-all border-2 shadow-sm ${compareList.find(item => item.id === ev.id) ? 'bg-amber-500 text-white border-amber-500 shadow-amber-500/20' : 'bg-white text-slate-500 hover:text-slate-700 border-white hover:border-slate-200'}`}
                                >
                                    <Scale className="w-4 h-4" /> {compareList.find(item => item.id === ev.id) ? 'Bỏ so sánh' : '+ So sánh'}
                                </button>
                            </div>

                        </div>
                        );
                    })}
                </div>
            )}

            {!user && !isLoading && evaluations.length > 0 && (
                <div className="mt-12 mb-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-slate-50 text-slate-400 font-bold">Vẫn còn rất nhiều đánh giá khác...</span>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 rounded-3xl text-center shadow-xl shadow-blue-600/20 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                        
                        <Lock className="w-10 h-10 text-white/80 mx-auto mb-4 relative z-10" />
                        <h4 className="font-black text-2xl mb-2 relative z-10">Gia nhập Cộng đồng Radar</h4>
                        <p className="text-blue-100 mb-8 max-w-md mx-auto relative z-10 font-medium">Hàng trăm đánh giá công tâm từ những người đi trước đang chờ bạn khám phá. Đăng nhập ngay để xem toàn bộ!</p>
                        <button 
                            onClick={onLogin}
                            className="bg-white text-blue-600 hover:scale-105 active:scale-95 font-black py-4 px-8 rounded-xl shadow-lg transition-all relative z-10"
                        >
                            Đăng nhập bằng Google
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Compare Action Bar */}
            {compareList.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300 w-[90%] max-w-lg">
                    <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-700">
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">Chế độ So sánh</span>
                            <span className="text-xs text-slate-400 font-medium">Đã chọn {compareList.length}/2 trung tâm</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setCompareList([])}
                                className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button 
                                onClick={() => setIsCompareModalOpen(true)}
                                disabled={compareList.length !== 2}
                                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-black rounded-xl transition-all flex items-center gap-2"
                            >
                                <Scale className="w-4 h-4" /> So sánh ngay
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            {selectedEval && (
                <EvaluationModal 
                    evaluation={selectedEval}
                    criteriaData={criteriaData}
                    currentUser={user}
                    onClose={() => setSelectedEval(null)}
                    onCommentAdded={() => handleCommentAdded(selectedEval.id)}
                />
            )}

            {isCompareModalOpen && (
                <CompareModal 
                    compareList={compareList}
                    criteriaData={criteriaData}
                    currentUser={user}
                    onClose={() => setIsCompareModalOpen(false)}
                />
            )}
        </div>
    );
}
