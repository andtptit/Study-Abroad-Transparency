import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Info, CheckCircle2, Star, Crown } from 'lucide-react';

export default function SurveyStep({ currentQIndex, answers, onSelectAnswer, onNext, onBack, criteriaData }) {
    const currentCriterion = criteriaData[currentQIndex];
    const currentAnswer = answers[currentCriterion.id];
    
    // State to track which card is currently being hovered
    const [hoveredStar, setHoveredStar] = useState(null);

    // Determine the active detail to show on the right panel
    const activeDetailStar = hoveredStar !== null ? hoveredStar : currentAnswer;
    const activeOptionInfo = currentCriterion.options.find(o => o.stars === activeDetailStar);

    return (
        <div className="w-[95%] max-w-[1400px] mx-auto animate-in fade-in slide-in-from-right-8 duration-300">
            {/* Header & Progress Bar (Full Width) */}
            <div className="w-full max-w-5xl mx-auto mb-10">
                <div className="w-full bg-slate-200 h-2 rounded-full mb-8 overflow-hidden">
                    <div
                        className="bg-blue-600 h-full transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${((currentQIndex) / criteriaData.length) * 100}%` }}
                    ></div>
                </div>

                <div className="text-center">
                    <span className="inline-block py-1 px-4 bg-blue-100 text-blue-700 font-bold text-xs rounded-full uppercase tracking-wider mb-4">
                        {currentCriterion.title}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                        {currentCriterion.question}
                    </h2>
                </div>
            </div>

            {/* Split Panel Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
                
                {/* Left Panel: Options List (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                    {currentCriterion.options.map((opt) => {
                        const isSelected = currentAnswer === opt.stars;
                        const isHovered = hoveredStar === opt.stars;

                        // Default Variables
                        let badgeBg = '';
                        let cardStyle = '';
                        let descStyle = '';
                        let badgeFontSize = 'text-2xl sm:text-3xl';
                        let glowEffect = '';
                        let textGlow = '';

                        // 1 STAR: Danger (Red)
                        if (opt.stars === 1) {
                            badgeBg = isSelected ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 'bg-red-50 text-red-400';
                            cardStyle = isSelected 
                                ? 'border-red-400 bg-red-50 shadow-md ring-1 ring-red-400/10' 
                                : (isHovered ? 'border-red-200 bg-white shadow-sm' : 'border-red-50 bg-white/50 hover:border-red-100 hover:shadow-sm');
                            descStyle = 'text-slate-600 font-normal';
                        }
                        
                        // 2 STAR: Warning (Orange)
                        if (opt.stars === 2) {
                            badgeBg = isSelected ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'bg-orange-50 text-orange-400';
                            cardStyle = isSelected 
                                ? 'border-orange-400 bg-orange-50 shadow-md ring-1 ring-orange-400/10' 
                                : (isHovered ? 'border-orange-200 bg-white shadow-sm' : 'border-orange-50 bg-white/50 hover:border-orange-100 hover:shadow-sm');
                            descStyle = 'text-slate-700 font-medium';
                        }

                        // 3 STAR: Neutral (Blue)
                        if (opt.stars === 3) {
                            badgeBg = isSelected ? 'bg-blue-500 text-white shadow-lg shadow-blue-100' : 'bg-blue-50 text-blue-400';
                            cardStyle = isSelected 
                                ? 'border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-500/10' 
                                : (isHovered ? 'border-blue-200 bg-white shadow-sm' : 'border-blue-50 bg-white/50 hover:border-blue-100 hover:shadow-sm');
                            descStyle = 'text-slate-800 font-semibold';
                        }

                        // VIP Styles for 4 Stars
                        if (opt.stars === 4) {
                            badgeBg = isSelected 
                                ? 'bg-[#f59e0b] text-white shadow-xl shadow-[#f59e0b]/30' 
                                : 'bg-[#FFECB3] text-[#d97706] shadow-md shadow-[#f59e0b]/10';
                            cardStyle = isSelected 
                                ? 'border-[#f59e0b] bg-[#fffbeb] shadow-xl shadow-[#f59e0b]/20 ring-1 ring-[#f59e0b]/40' 
                                : (isHovered ? 'border-[#fcd34d] bg-white shadow-md shadow-[#fcd34d]/20' : 'border-[#fef3c7] bg-[#fffbeb]/20 hover:border-[#fcd34d] hover:shadow-sm');
                            badgeFontSize = 'text-3xl sm:text-4xl';
                            textGlow = isSelected ? 'drop-shadow-sm' : '';
                            descStyle = 'text-slate-900 font-bold';
                        }
                        
                        // VIP Styles for 5 Stars
                        if (opt.stars === 5) {
                            badgeBg = isSelected 
                                ? 'bg-[#22c55e] text-white shadow-2xl shadow-[#22c55e]/40' 
                                : 'bg-[#dcfce7] text-[#16a34a] shadow-lg shadow-[#22c55e]/20';
                            cardStyle = isSelected 
                                ? 'border-[#22c55e] bg-[#f0fdf4] shadow-2xl shadow-[#22c55e]/30 ring-1 ring-[#22c55e]/40 transform scale-[1.01]' 
                                : (isHovered ? 'border-[#86efac] bg-white shadow-lg shadow-[#86efac]/30 scale-[1.005]' : 'border-[#dcfce7] bg-[#f0fdf4]/30 hover:border-[#86efac] hover:shadow-md');
                            badgeFontSize = 'text-4xl sm:text-5xl font-extrabold';
                            glowEffect = ''; // Removed animate-pulse as per user request
                            textGlow = 'drop-shadow-md';
                            descStyle = 'text-slate-900 font-bold'; // Changed from font-black to font-bold
                        }

                        return (
                            <button
                                key={opt.stars}
                                onClick={() => onSelectAnswer(opt.stars)}
                                onMouseEnter={() => setHoveredStar(opt.stars)}
                                onMouseLeave={() => setHoveredStar(null)}
                                className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 flex items-start gap-4 sm:gap-5 relative overflow-hidden ${cardStyle} ${glowEffect}`}
                            >
                                <div className={`
                                    flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl shrink-0 font-black transition-colors ${badgeBg}
                                `}>
                                    <span className={`${badgeFontSize} ${textGlow} leading-none mb-0.5`}>{opt.stars}</span>
                                    <span className="text-[10px] sm:text-xs uppercase block font-bold opacity-80 mt-0.5">Sao</span>
                                </div>
                                
                                <div className="pt-0.5 sm:pt-1 flex-1 relative">
                                    <div className={`text-[14px] sm:text-[16px] leading-relaxed transition-colors duration-300
                                        ${isSelected || isHovered ? 'text-slate-900' : 'text-slate-600'}
                                        line-clamp-2 pr-6 ${descStyle}
                                    `} style={{ whiteSpace: 'pre-line' }}>
                                        {opt.desc}
                                    </div>

                                    {/* Icon góc trên bên phải cho 4 & 5 sao */}
                                    {opt.stars === 4 && (
                                        <div className="absolute top-0 right-0 text-[#f59e0b] opacity-80">
                                            <Star className="w-5 h-5 fill-current" />
                                        </div>
                                    )}
                                    {opt.stars === 5 && (
                                        <div className="absolute top-0 right-0 text-[#22c55e] animate-bounce opacity-90">
                                            <Crown className="w-6 h-6 fill-current" />
                                        </div>
                                    )}
                                </div>
                                
                                {isSelected && opt.stars <= 3 && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 animate-in zoom-in duration-300 hidden sm:block">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Right Panel: Detail Preview (Sticky, 5 cols) */}
                <div className="lg:col-span-5 lg:sticky lg:top-8 w-full">
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 min-h-[360px] flex flex-col shadow-md transition-all duration-300 relative overflow-hidden">
                        
                        {/* Dynamic background styling based on active star */}
                        {activeOptionInfo?.stars === 5 && (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#dcfce7]/50 to-transparent pointer-events-none" />
                        )}
                        {activeOptionInfo?.stars === 4 && (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FFECB3]/30 to-transparent pointer-events-none" />
                        )}
                        {activeOptionInfo?.stars === 3 && (
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent pointer-events-none" />
                        )}
                        {activeOptionInfo?.stars === 2 && (
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent pointer-events-none" />
                        )}
                        {activeOptionInfo?.stars === 1 && (
                            <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent pointer-events-none" />
                        )}

                        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-4 relative z-10">
                            <Info className="w-5 h-5 text-slate-400" />
                            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Chi tiết đánh giá</h3>
                        </div>

                        {activeOptionInfo ? (
                            <div key={activeOptionInfo.stars} className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-300 relative z-10">
                                <div className="flex items-end gap-3 mb-6">
                                    <span className={`text-5xl font-black leading-none
                                        ${activeOptionInfo.stars === 5 ? 'text-[#22c55e]' : 
                                          activeOptionInfo.stars === 4 ? 'text-[#f59e0b]' : 
                                          activeOptionInfo.stars === 3 ? 'text-blue-600' :
                                          activeOptionInfo.stars === 2 ? 'text-orange-500' :
                                          'text-red-500'}
                                    `}>
                                        {activeOptionInfo.stars}
                                    </span>
                                    <span className="text-xl font-bold text-slate-500 mb-1 uppercase tracking-wider">Sao</span>
                                    {activeOptionInfo.stars === 5 && (
                                        <Crown className="w-8 h-8 text-[#22c55e] fill-current animate-pulse mb-1 ml-2" />
                                    )}
                                    {activeOptionInfo.stars === 4 && (
                                        <Star className="w-7 h-7 text-[#f59e0b] fill-current mb-1 ml-2" />
                                    )}
                                </div>
                                <div className={`prose prose-slate prose-p:leading-relaxed prose-li:marker:text-blue-500 font-medium text-[16px] sm:text-[17px] 
                                    ${activeOptionInfo.stars === 5 ? 'text-slate-800' : 'text-slate-700'}
                                `} style={{ whiteSpace: 'pre-line' }}>
                                    {activeOptionInfo.desc}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 relative z-10">
                                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-2xl font-black text-slate-400">?</span>
                                </div>
                                <p className="text-slate-500 font-medium max-w-[200px]">Hãy chọn hoặc di chuột vào số sao để xem chi tiết.</p>
                            </div>
                        )}
                        
                        {/* Status Footer in Preview Panel */}
                        <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-sm font-bold relative z-10">
                            <span className="text-slate-500">Tiêu chí {currentQIndex + 1}/{criteriaData.length}</span>
                            {currentAnswer ? (
                                <span className={`flex items-center gap-1 
                                    ${currentAnswer === 5 ? 'text-[#22c55e]' : 
                                      currentAnswer === 4 ? 'text-[#f59e0b]' : 
                                      currentAnswer === 3 ? 'text-blue-600' :
                                      currentAnswer === 2 ? 'text-orange-500' :
                                      'text-red-500'}`}>
                                    <CheckCircle2 className="w-5 h-5" /> Đã chọn
                                </span>
                            ) : (
                                <span className="text-amber-500">Chưa chọn</span>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Điều hướng Next/Prev */}
            <div className="mt-10 max-w-3xl mx-auto flex items-center justify-between border-t border-slate-200 pt-6">
                <button 
                    onClick={onBack} 
                    className="flex items-center gap-2 py-3 px-4 sm:px-6 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl font-bold transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> Quay lại
                </button>
                
                <button 
                    onClick={onNext}
                    disabled={!currentAnswer}
                    className={`flex items-center gap-2 py-3 px-6 sm:px-8 rounded-xl font-bold text-base sm:text-lg transition-all
                        ${currentAnswer 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 hover:-translate-y-0.5' 
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70'
                        }
                    `}
                >
                    Tiếp tục <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
