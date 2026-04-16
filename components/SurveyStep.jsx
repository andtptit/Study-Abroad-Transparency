import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function SurveyStep({ currentQIndex, answers, onSelectAnswer, onNext, onBack, criteriaData }) {
    const currentCriterion = criteriaData[currentQIndex];
    const currentAnswer = answers[currentCriterion.id];

    return (
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-right-8 duration-300">
            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full mb-8 overflow-hidden">
                <div
                    className="bg-blue-600 h-full transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${((currentQIndex) / criteriaData.length) * 100}%` }}
                ></div>
            </div>

            <div className="mb-10 text-center">
                <span className="inline-block py-1 px-4 bg-blue-100 text-blue-700 font-bold text-xs rounded-full uppercase tracking-wider mb-4">
                    {currentCriterion.title}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                    {currentCriterion.question}
                </h2>
            </div>

            {/* Các lựa chọn (1 -> 5 sao) */}
            <div className="space-y-4">
                {currentCriterion.options.map((opt) => {
                    const isSelected = currentAnswer === opt.stars;

                    return (
                        <button
                            key={opt.stars}
                            onClick={() => onSelectAnswer(opt.stars)}
                            className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 flex items-start gap-4 sm:gap-6 group relative overflow-hidden
                                ${isSelected
                                    ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500/20'
                                    : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                                }
                            `}
                        >
                            <div className={`
                                flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl shrink-0 font-black text-2xl transition-colors
                                ${isSelected ? 'bg-blue-500 text-white shadow-lg shadow-blue-200' : 'bg-blue-50 text-blue-400 group-hover:bg-blue-100 group-hover:text-blue-600'}
                            `}>
                                {opt.stars}<span className="text-[10px] sm:text-xs uppercase block -mt-1 font-bold opacity-80">Sao</span>
                            </div>
                            
                            <div className="pt-0.5 sm:pt-1 flex-1">
                                <div className={`text-[15px] sm:text-base font-medium leading-relaxed transition-all duration-300
                                    ${isSelected ? 'text-blue-900' : 'text-slate-600 group-hover:text-slate-800'}
                                    ${!isSelected && 'line-clamp-2 group-hover:line-clamp-none'}
                                `} style={{ whiteSpace: 'pre-line' }}>
                                    {opt.desc}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Điều hướng Next/Prev */}
            <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-6">
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
