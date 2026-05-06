import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Heart, MessageCircle, Send, Loader2 } from 'lucide-react';
import { fetchEvaluationComments, addEvaluationComment, loginWithGoogle } from '../firebase';

export default function EvaluationModal({ evaluation, criteriaData, currentUser, onClose, onCommentAdded }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!evaluation || !currentUser) return;
        
        const loadComments = async () => {
            setIsLoadingComments(true);
            const data = await fetchEvaluationComments(evaluation.id);
            setComments(data);
            setIsLoadingComments(false);
        };
        
        loadComments();
    }, [evaluation, currentUser]);

    if (!evaluation) return null;

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
                        <p className="text-slate-500 mb-8 font-medium">Để xem chi tiết bảng điểm và tham gia bình luận, vui lòng đăng nhập bằng Google.</p>
                        
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

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;
        
        setIsSubmitting(true);
        const commentId = await addEvaluationComment(evaluation.id, currentUser.profile, newComment);
        if (commentId) {
            // Optimistic UI update
            setComments([...comments, {
                id: commentId,
                userId: currentUser.uid,
                userDisplayName: currentUser.displayName || 'Ẩn danh',
                userPhotoURL: currentUser.photoURL || '',
                content: newComment.trim(),
                createdAt: { seconds: Date.now() / 1000 } // mock timestamp
            }]);
            setNewComment('');
            if (onCommentAdded) onCommentAdded();
        }
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="shrink-0 p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                    <div className="flex gap-4 items-center">
                        {evaluation.isAnonymous ? (
                            <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center text-xl font-bold text-slate-400">?</div>
                        ) : (
                            <img src={evaluation.userPhotoURL || `https://ui-avatars.com/api/?name=${evaluation.userDisplayName}&background=random`} alt="Avatar" className="w-14 h-14 rounded-full border-4 border-white shadow-sm" />
                        )}
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-800 text-lg">{evaluation.isAnonymous ? 'Người dùng ẩn danh' : evaluation.userDisplayName}</h3>
                                {!evaluation.isAnonymous && evaluation.userLevel && (
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: evaluation.userLevel.bg, color: evaluation.userLevel.color }}>
                                        {evaluation.userLevel.icon} {evaluation.userLevel.name}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-slate-500 font-medium mt-0.5">
                                {evaluation.createdAt ? new Date(evaluation.createdAt.seconds * 1000).toLocaleDateString('vi-VN') : 'Mới đây'}
                            </p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={onClose}
                        className="p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 rounded-full transition-colors shadow-sm"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    
                    {/* Summary Info */}
                    <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:justify-between text-center sm:text-left">
                        <div>
                            <h2 className="text-2xl font-black text-blue-950 mb-1">{evaluation.centerName}</h2>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                                    evaluation.segment === 'premium' ? 'bg-blue-100 text-blue-700' :
                                    evaluation.segment === 'value' ? 'bg-green-100 text-green-700' :
                                    evaluation.segment === 'warning' ? 'bg-red-100 text-red-700' :
                                    'bg-amber-100 text-amber-700'
                                }`}>
                                    {evaluation.segment === 'premium' ? 'Cao cấp' : evaluation.segment === 'value' ? 'Thông minh' : evaluation.segment === 'warning' ? 'Rủi ro' : 'Phổ thông'}
                                </span>
                                <span className="text-sm font-bold text-slate-600 bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-100">
                                    💰 {evaluation.price} Triệu VNĐ
                                </span>
                            </div>
                        </div>
                        <div className="shrink-0 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 text-center">
                            <div className="text-3xl font-black text-amber-500">{evaluation.finalScore}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tổng điểm</div>
                        </div>
                    </div>

                    {/* Criteria Breakdown */}
                    <h4 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-blue-500" /> Bảng điểm chi tiết
                    </h4>
                    <div className="space-y-4 mb-10">
                        {criteriaData.map(criterion => {
                            const score = evaluation.answers[criterion.id] || 0;
                            const percentage = (score / 5) * 100;
                            return (
                                <div key={criterion.id} className="relative">
                                    <div className="flex justify-between items-end mb-1.5">
                                        <span className="font-bold text-slate-700 text-sm">{criterion.title}</span>
                                        <span className="font-black text-slate-900 text-sm">{score}/5</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${
                                                score >= 4 ? 'bg-green-500' : score === 3 ? 'bg-amber-400' : 'bg-red-500'
                                            }`} 
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Comments Section */}
                    <div className="border-t border-slate-100 pt-8">
                        <h4 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-blue-500" /> Thảo luận cộng đồng
                        </h4>
                        
                        {isLoadingComments ? (
                            <div className="py-8 text-center flex flex-col items-center justify-center text-slate-400">
                                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                                <span className="text-sm font-medium">Đang tải bình luận...</span>
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="py-8 text-center text-slate-500 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <p className="font-medium text-sm">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {comments.map(comment => (
                                    <div key={comment.id} className="flex gap-3">
                                        <img src={comment.userPhotoURL || `https://ui-avatars.com/api/?name=${comment.userDisplayName}&background=random`} alt="Avatar" className="w-10 h-10 rounded-full shrink-0 mt-1" />
                                        <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none p-4">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-bold text-slate-800 text-sm">{comment.userDisplayName}</span>
                                                <span className="text-[10px] font-medium text-slate-400">
                                                    {comment.createdAt?.seconds ? new Date(comment.createdAt.seconds * 1000).toLocaleDateString('vi-VN') : 'Vừa xong'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600 whitespace-pre-wrap">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Comment Input */}
                <div className="shrink-0 p-4 border-t border-slate-100 bg-white">
                    <form onSubmit={handleAddComment} className="flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Nhập bình luận của bạn..."
                            className="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium"
                        />
                        <button 
                            type="submit"
                            disabled={!newComment.trim() || isSubmitting}
                            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:hover:bg-blue-600 flex items-center justify-center shrink-0"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
