import React, { useState, useEffect } from 'react';
import { X, Star, AlertTriangle, CheckCircle2, History, Lock, Heart } from 'lucide-react';
import { fetchEvaluations, toggleLikeEvaluation } from '../firebase';

export default function HistoryModal({ isOpen, onClose, user, onLogin }) {
    const [evaluations, setEvaluations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) return;
        const loadHistory = async () => {
            setIsLoading(true);
            const limitCount = user ? 50 : 3;
            const data = await fetchEvaluations(limitCount);
            setEvaluations(data);
            setIsLoading(false);
        };
        loadHistory();
    }, [isOpen, user]);

    const handleLike = async (evalId, currentLikedBy) => {
        if (!user) {
            alert('Vui lòng đăng nhập để thả tim và ủng hộ người đánh giá nhé!');
            return;
        }
        const isLiking = !currentLikedBy?.includes(user.uid);
        
        // Cập nhật UI ngay lập tức để tạo cảm giác mượt mà (Optimistic UI)
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

    if (!isOpen) return null;

    const renderSegmentBadge = (status, title, color) => {
        return (
            <div className="px-2 py-0.5 rounded-full text-[10px] font-bold border" style={{ backgroundColor: `${color}10`, color: color, borderColor: `${color}30` }}>
                {title}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                            <History className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800 text-lg">Bảng tin đánh giá</h2>
                            <p className="text-xs text-slate-500">{user ? 'Cộng đồng đánh giá' : '3 đánh giá mới nhất'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-3 text-slate-400">
                            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <span className="text-sm font-medium">Đang tải dữ liệu...</span>
                        </div>
                    ) : evaluations.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 font-medium border-2 border-dashed border-slate-200 rounded-2xl">
                            Chưa có lượt đánh giá nào.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {evaluations.map((ev) => (
                                <div key={ev.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    {/* User Info Header */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            {ev.userPhotoURL ? (
                                                <img src={ev.userPhotoURL} alt="Avatar" className="w-10 h-10 rounded-full border border-slate-200 object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm">
                                                    {ev.userDisplayName ? ev.userDisplayName[0].toUpperCase() : 'U'}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm leading-tight">
                                                    {ev.userDisplayName || 'Người dùng ẩn danh'}
                                                </div>
                                                {ev.userLevel ? (
                                                    <span 
                                                        className="text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 mt-0.5 w-max"
                                                        style={{ backgroundColor: ev.userLevel.bg, color: ev.userLevel.color }}
                                                    >
                                                        {ev.userLevel.icon} {ev.userLevel.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">Thành viên ẩn danh</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Evaluation Body */}
                                    <div className="bg-slate-50 p-3 rounded-xl mb-3 border border-slate-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-800 text-sm leading-tight pr-2 flex items-center gap-1.5">
                                                🏫 {ev.centerName || 'Trung tâm ẩn danh'}
                                            </h3>
                                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg shrink-0">
                                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                <span className="font-bold text-amber-700 text-sm">{ev.finalScore}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2 items-center">
                                            {renderSegmentBadge(ev.segment, ev.segment === 'premium' ? 'Cao cấp' : ev.segment === 'value' ? 'Thông minh' : ev.segment === 'warning' ? 'Rủi ro' : 'Phổ thông', ev.segment === 'premium' ? '#3b82f6' : ev.segment === 'value' ? '#22c55e' : ev.segment === 'warning' ? '#ef4444' : '#f59e0b')}
                                            <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                                                {ev.price}tr VNĐ
                                            </span>
                                        </div>
                                    </div>

                                    {/* Footer: Date & Like Button */}
                                    <div className="flex justify-between items-center text-xs text-slate-400 mt-2 pt-3 border-t border-slate-50">
                                        <span className="font-medium">{ev.createdAt ? new Date(ev.createdAt.seconds * 1000).toLocaleDateString('vi-VN') : 'Vừa xong'}</span>
                                        
                                        <button 
                                            onClick={() => handleLike(ev.id, ev.likedBy)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold transition-all hover:scale-105 active:scale-95 ${ev.likedBy?.includes(user?.uid) ? 'bg-red-50 text-red-500 ring-1 ring-red-100' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 ring-1 ring-slate-200/50'}`}
                                        >
                                            <svg className={`w-4 h-4 ${ev.likedBy?.includes(user?.uid) ? 'fill-red-500 stroke-red-500' : 'fill-transparent stroke-current stroke-[2.5]'}`} viewBox="0 0 24 24">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                            </svg>
                                            {ev.likesCount || 0}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!user && !isLoading && evaluations.length > 0 && (
                        <div className="mt-8 mb-4">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-slate-50/50 text-slate-400 font-medium">Muốn xem thêm?</span>
                                </div>
                            </div>
                            <div className="mt-6 bg-blue-50 border border-blue-100 p-5 rounded-2xl text-center">
                                <Lock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                                <h4 className="font-bold text-slate-800 mb-2">Đăng nhập để xem toàn bộ</h4>
                                <p className="text-xs text-slate-500 mb-4">Hàng trăm đánh giá trung tâm du học khác đang chờ bạn khám phá.</p>
                                <button 
                                    onClick={onLogin}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-colors"
                                >
                                    Đăng nhập bằng Google
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
