import React from 'react';
import { X, ShieldCheck, Star } from 'lucide-react';
import { loginWithGoogle } from '../firebase';

export default function CompareModal({ compareList, criteriaData, currentUser, onClose }) {
    if (!compareList || compareList.length !== 2) return null;

    // Handle non-logged in users
    if (!currentUser) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck className="w-10 h-10 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Yêu cầu Đăng nhập</h2>
                        <p className="text-slate-500 mb-8 font-medium">Để sử dụng tính năng Bàn cân So Sánh, vui lòng đăng nhập bằng Google.</p>
                        
                        <button 
                            onClick={loginWithGoogle}
                            className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-700 font-bold rounded-xl transition-all shadow-sm"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                            Đăng nhập với Google
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const [evalA, evalB] = compareList;

    const renderSegmentBadge = (status, title, color) => (
        <span className="px-3 py-1 rounded-full text-xs font-bold border" style={{ backgroundColor: `${color}10`, color: color, borderColor: `${color}30` }}>
            {title}
        </span>
    );

    const getSegmentDisplay = (segment) => {
        if (segment === 'premium') return renderSegmentBadge('premium', 'Cao cấp', '#3b82f6');
        if (segment === 'value') return renderSegmentBadge('value', 'Thông minh', '#22c55e');
        if (segment === 'warning') return renderSegmentBadge('warning', 'Rủi ro', '#ef4444');
        return renderSegmentBadge('standard', 'Phổ thông', '#f59e0b');
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-50 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200 border-4 border-white">
                
                {/* Header */}
                <div className="shrink-0 p-6 bg-white border-b border-slate-100 flex justify-between items-center z-10 shadow-sm relative">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Bàn cân so sánh</h2>
                        <p className="text-sm font-medium text-slate-500 mt-1">So sánh chi tiết 2 bài đánh giá để đưa ra quyết định tốt nhất.</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 hover:rotate-90 text-slate-500 rounded-full transition-all duration-300"
                    >
                        <X className="w-5 h-5 font-bold" />
                    </button>
                </div>

                {/* Body Split View */}
                <div className="flex-1 overflow-y-auto flex flex-col md:flex-row relative bg-white">
                    {/* Divider Line for Desktop */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 z-10"></div>
                    
                    {/* Column A */}
                    <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/30">
                        {/* Header A */}
                        <div className="text-center mb-8 relative">
                            {evalA.isAdminVerified && (
                                <div className="absolute left-0 top-0 text-blue-500 bg-blue-50 p-2 rounded-xl" title="Đã được Admin duyệt">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                            )}
                            <div className="w-16 h-16 rounded-full border-4 border-white shadow-md mx-auto mb-3 overflow-hidden bg-white">
                                {evalA.userPhotoURL ? (
                                    <img src={evalA.userPhotoURL} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xl">
                                        {evalA.userDisplayName ? evalA.userDisplayName[0].toUpperCase() : '?'}
                                    </div>
                                )}
                            </div>
                            <h3 className="text-xl font-black text-blue-950 px-8">{evalA.centerName || 'Ẩn danh'}</h3>
                            <p className="text-sm font-medium text-slate-500 mt-1">Đánh giá bởi: <span className="font-bold text-slate-700">{evalA.userDisplayName || 'Ẩn danh'}</span></p>
                        </div>

                        {/* Stats A */}
                        <div className="flex justify-center gap-4 mb-8">
                            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-center min-w-[100px]">
                                <div className="text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
                                    {evalA.finalScore} <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                </div>
                                <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Tổng điểm</div>
                            </div>
                            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-center min-w-[100px]">
                                <div className="text-2xl font-black text-blue-600">{evalA.price}</div>
                                <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Triệu VNĐ</div>
                            </div>
                        </div>
                        
                        <div className="flex justify-center mb-8">
                            {getSegmentDisplay(evalA.segment)}
                        </div>

                        {/* Criteria Breakdown A */}
                        <div className="space-y-6">
                            {criteriaData.map(criterion => {
                                const score = evalA.answers[criterion.id] || 0;
                                return (
                                    <div key={criterion.id} className="text-center">
                                        <div className="font-bold text-slate-700 text-sm mb-2">{criterion.title}</div>
                                        <div className="flex justify-center gap-1.5">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <div 
                                                    key={star} 
                                                    className={`h-2 rounded-full transition-all ${star <= score ? (score >= 4 ? 'bg-green-500 w-6' : score === 3 ? 'bg-amber-400 w-6' : 'bg-red-500 w-6') : 'bg-slate-200 w-4'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Column B */}
                    <div className="flex-1 p-6 bg-slate-50/30">
                        {/* Header B */}
                        <div className="text-center mb-8 relative">
                            {evalB.isAdminVerified && (
                                <div className="absolute right-0 top-0 text-blue-500 bg-blue-50 p-2 rounded-xl" title="Đã được Admin duyệt">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                            )}
                            <div className="w-16 h-16 rounded-full border-4 border-white shadow-md mx-auto mb-3 overflow-hidden bg-white">
                                {evalB.userPhotoURL ? (
                                    <img src={evalB.userPhotoURL} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xl">
                                        {evalB.userDisplayName ? evalB.userDisplayName[0].toUpperCase() : '?'}
                                    </div>
                                )}
                            </div>
                            <h3 className="text-xl font-black text-blue-950 px-8">{evalB.centerName || 'Ẩn danh'}</h3>
                            <p className="text-sm font-medium text-slate-500 mt-1">Đánh giá bởi: <span className="font-bold text-slate-700">{evalB.userDisplayName || 'Ẩn danh'}</span></p>
                        </div>

                        {/* Stats B */}
                        <div className="flex justify-center gap-4 mb-8">
                            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-center min-w-[100px]">
                                <div className="text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
                                    {evalB.finalScore} <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                </div>
                                <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Tổng điểm</div>
                            </div>
                            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-center min-w-[100px]">
                                <div className="text-2xl font-black text-blue-600">{evalB.price}</div>
                                <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Triệu VNĐ</div>
                            </div>
                        </div>

                        <div className="flex justify-center mb-8">
                            {getSegmentDisplay(evalB.segment)}
                        </div>

                        {/* Criteria Breakdown B */}
                        <div className="space-y-6">
                            {criteriaData.map(criterion => {
                                const score = evalB.answers[criterion.id] || 0;
                                return (
                                    <div key={criterion.id} className="text-center">
                                        <div className="font-bold text-slate-700 text-sm mb-2">{criterion.title}</div>
                                        <div className="flex justify-center gap-1.5">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <div 
                                                    key={star} 
                                                    className={`h-2 rounded-full transition-all ${star <= score ? (score >= 4 ? 'bg-green-500 w-6' : score === 3 ? 'bg-amber-400 w-6' : 'bg-red-500 w-6') : 'bg-slate-200 w-4'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
