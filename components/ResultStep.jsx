import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, RotateCcw, ClipboardList, X, Star, MapPin } from 'lucide-react';

const CustomPerceptualMap = ({ price, stars, centerName, color }) => {
    // Chuyển đổi sang số để đảm bảo tính toán chính xác
    const numPrice = parseFloat(price) || 0;
    const numStars = parseFloat(stars) || 3;
    
    // x: 0-130 (Chi phí), y: 1-5 (Chất lượng)
    const leftPos = (Math.min(Math.max(numPrice, 0), 130) / 130) * 100;
    const bottomPos = (Math.min(Math.max(numStars, 1), 5) - 1) / 4 * 100;

    return (
        <div className="relative w-full aspect-square bg-slate-50 border border-slate-200 rounded-3xl shadow-sm select-none p-6">
            <div className="relative w-full h-full">
                
                {/* 1. Background Layer (Quadrants & Grid) */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden border border-slate-100 bg-white">
                    {/* Quadrant Colors */}
                    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                        <div className="bg-[#f6ffed]/60 border-r border-b border-slate-100" />
                        <div className="bg-[#f0f7ff]/60 border-b border-slate-100" />
                        <div className="bg-[#fffbe6]/60 border-r border-slate-100" />
                        <div className="bg-[#fff1f0]/60" />
                    </div>

                    {/* High Precision Grid (13 columns for Price, 8 rows for Stars - every 0.5*) */}
                    <div className="absolute inset-0 grid grid-cols-[repeat(13,1fr)] grid-rows-[repeat(8,1fr)] opacity-[0.07] pointer-events-none">
                        {[...Array(104)].map((_, i) => (
                            <div key={i} className="border-r border-b border-slate-500" />
                        ))}
                    </div>

                    {/* Centered Crosshair Axes */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-400/50 z-10" />
                    <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-400/50 z-10" />

                    {/* Quadrant Labels (Static Corners) */}
                    <div className="absolute top-3 left-3 flex items-start gap-1.5 px-3 py-2 bg-white/95 rounded-xl border border-green-200 shadow-sm z-20 max-w-[120px]">
                        <Star size={14} className="text-green-500 fill-green-500 shrink-0 mt-0.5" />
                        <span className="text-green-600 font-bold text-[11px] sm:text-[12px] leading-tight text-left italic">
                            Lựa chọn thông minh, giá thấp, chất lượng cao
                        </span>
                    </div>
                    <div className="absolute top-3 right-3 flex items-start gap-1.5 px-3 py-2 bg-white/95 rounded-xl border border-blue-200 shadow-sm z-20 max-w-[120px] text-right justify-end">
                        <span className="text-blue-600 font-bold text-[11px] sm:text-[12px] leading-tight italic">
                            Lựa chọn cao cấp, giá cao, chất lượng cao
                        </span>
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-start gap-1.5 px-3 py-2 bg-white/95 rounded-xl border border-orange-200 shadow-sm z-20 max-w-[120px]">
                        <span className="text-orange-600 font-bold text-[11px] sm:text-[12px] leading-tight text-left italic">
                            Lựa chọn phổ thông, giá thấp, chất lượng thấp
                        </span>
                    </div>
                    <div className="absolute bottom-3 right-3 flex items-start gap-1.5 px-3 py-2 bg-white/95 rounded-xl border border-red-200 shadow-sm z-20 max-w-[120px] text-right justify-end">
                        <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                        <span className="text-red-600 font-bold text-[11px] sm:text-[12px] leading-tight italic">
                            Lựa chọn rủi ro, giá cao, chất lượng thấp
                        </span>
                    </div>
                </div>

                {/* 2. Ticks & Labels */}
                {[0, 20, 65, 110, 130].map(val => (
                    <div key={`x-${val}`} 
                        className="absolute bottom-0 translate-y-6 flex flex-col items-center -translate-x-1/2"
                        style={{ left: `${(val / 130) * 100}%` }}
                    >
                        <div className="w-px h-1 bg-slate-300 -translate-y-1" />
                        <span className="text-[10px] font-bold text-slate-400">{val}tr</span>
                    </div>
                ))}

                {[1, 2, 3, 4, 5].map(val => (
                    <div key={`y-${val}`} 
                        className="absolute left-0 -translate-x-8 flex items-center translate-y-1/2"
                        style={{ bottom: `${((val - 1) / 4) * 100}%` }}
                    >
                        <span className="text-[10px] font-bold text-slate-400">{val}*</span>
                        <div className="w-1 h-px bg-slate-300 translate-x-1" />
                    </div>
                ))}

                {/* Axis Titles */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Chi phí (Triệu VNĐ)</div>
                <div className="absolute top-1/2 -left-12 -translate-y-1/2 -rotate-90 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Chất lượng (Số sao)</div>

                {/* 3. Data Point (Target Indicator & Pin) */}
                <div 
                    className="absolute z-[100] transition-all duration-1000 ease-out"
                    style={{ 
                        left: `${leftPos}%`, 
                        bottom: `${bottomPos}%`,
                    }}
                >
                    {/* THE TARGET DOT (Always at the exact coordinate) */}
                    <div className="absolute w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-sm -translate-x-1/2 translate-y-1/2 z-[105]" />
                    <div className="absolute w-8 h-8 bg-blue-600/20 rounded-full -translate-x-1/2 translate-y-1/2 animate-ping" />

                    <div className="relative flex flex-col items-center">
                        {/* Tooltip Card */}
                        <div className="absolute bottom-full mb-12 whitespace-nowrap z-[110] animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-slate-100 text-center relative">
                                <h4 className="font-bold text-slate-800 text-sm mb-0.5">{centerName}</h4>
                                <p className="text-blue-600 font-bold text-[11px] flex items-center justify-center gap-1">
                                    {numStars} <Star size={10} className="fill-blue-600" /> - {numPrice}tr
                                </p>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
                            </div>
                        </div>

                        {/* Map Pin - Anchored to the dot */}
                        <div className="relative -translate-y-[6px] -translate-x-1/2 pointer-events-none">
                            <MapPin 
                                size={44} 
                                className="text-blue-600 fill-blue-600 drop-shadow-xl" 
                                strokeWidth={2}
                                style={{ transformOrigin: 'bottom center' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ResultStep({ centerName, price, answers, onReset, onUpdateAnswer, criteriaData }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const calculateResult = useMemo(() => {
        if (Object.keys(answers).length === 0) return { stars: 3, price: 65, status: 'unknown' };

        const totalWeight = criteriaData.reduce((acc, curr) => acc + (curr.weight || 1.0), 0);
        const totalScore = criteriaData.reduce((acc, curr) => {
            const star = answers[curr.id] || 0;
            return acc + (star * (curr.weight || 1.0));
        }, 0);
        
        const averageScore = totalWeight > 0 ? (totalScore / totalWeight) : 0;

        let status = '';
        let statusTitle = '';
        let statusDesc = '';
        let color = '';

        if (averageScore >= 3 && price >= 65) {
            status = 'premium';
            statusTitle = 'Phân khúc Cao cấp';
            statusDesc = 'Chất lượng cao đi kèm mức giá cao. Dành cho những ai cần sự an tâm tuyệt đối, dịch vụ trọn gói từ A-Z.';
            color = '#3b82f6';
        } else if (averageScore >= 3 && price < 65) {
            status = 'value';
            statusTitle = 'Thông minh';
            statusDesc = 'Ngon - Bổ - Rẻ! Trung tâm có chất lượng tốt nhưng tối ưu được chi phí vận hành nên mức phí rất cạnh tranh.';
            color = '#22c55e';
        } else if (averageScore < 3 && price >= 65) {
            status = 'warning';
            statusTitle = 'Lựa chọn rủi ro';
            statusDesc = 'Chất lượng dịch vụ thấp nhưng thu phí rất cao (hoặc có nhiều phụ phí ẩn). Hãy cẩn thận bị "Lùa gà"!';
            color = '#ef4444';
        } else {
            status = 'cheap';
            statusTitle = 'Lựa chọn phổ thông';
            statusDesc = 'Chi phí thấp nhưng dịch vụ lỏng lẻo, nhiều rủi ro bị "đem con bỏ chợ". Tiền nào của nấy.';
            color = '#f59e0b';
        }

        return {
            stars: Number(averageScore.toFixed(2)),
            price: price,
            status,
            statusTitle,
            statusDesc,
            color,
            qualityLabel: averageScore >= 4 ? 'Rất tốt' : averageScore >= 3 ? 'Tốt' : averageScore >= 2 ? 'Khá' : 'Kém'
        };
    }, [answers, price, criteriaData]);

    return (
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-center min-h-[calc(100vh-120px)] p-6 animate-in fade-in duration-700">
            {/* Cột Trái: Info Table Style */}
            <div className="w-full lg:w-4/12 flex flex-col items-center lg:items-center text-center space-y-8">
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 ring-8 ring-green-50 shadow-inner">
                        <CheckCircle2 size={48} className="text-green-500" strokeWidth={3} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2 leading-tight">Chúc mừng bạn!</h2>
                    <p className="text-slate-500 font-medium max-w-[280px]">
                        Dưới đây là vị thể của trung tâm bạn đã đánh giá.
                    </p>
                </div>

                <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-bold text-slate-800 text-sm text-left px-2">Dữ liệu chấm điểm</h3>
                    </div>
                    
                    <div className="divide-y divide-slate-100">
                        <div className="flex justify-between items-center p-4">
                            <span className="text-slate-600 font-medium text-sm">Chất lượng</span>
                            <span className="text-slate-800 font-bold text-sm">
                                {calculateResult.stars} / 5 <Star size={14} className="inline fill-amber-400 text-amber-400 mx-1" />
                                <span className="text-green-500 ml-1">({calculateResult.qualityLabel})</span>
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-4">
                            <span className="text-slate-600 font-medium text-sm">Chi phí</span>
                            <span className="text-slate-800 font-bold text-sm">
                                {(calculateResult.price || 0).toLocaleString()} VNĐ
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-4">
                            <span className="text-slate-600 font-medium text-sm">Phân khúc</span>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`} style={{ backgroundColor: `${calculateResult.color}15`, color: calculateResult.color }}>
                                {calculateResult.statusTitle}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-full max-w-sm gap-3 pt-2 px-4">
                    <button
                        onClick={onReset}
                        className="w-full py-4 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group"
                    >
                        <RotateCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" /> Đánh giá cơ sở khác
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full py-3 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                        <ClipboardList className="w-5 h-5" /> Xem lại câu trả lời
                    </button>
                </div>
            </div>

            {/* Cột Phải: Map Style Reference */}
            <div className="w-full lg:w-8/12">
                <div className="bg-white p-6 sm:p-12 rounded-[40px] border border-slate-200 shadow-xl">
                    <h3 className="font-bold text-slate-800 text-xl mb-12">Bản đồ định vị thương hiệu</h3>
                    
                    <div className="max-w-2xl mx-auto px-12 pb-12">
                        <CustomPerceptualMap 
                            stars={calculateResult.stars} 
                            price={calculateResult.price} 
                            centerName={centerName} 
                            color={calculateResult.color} 
                        />
                    </div>
                </div>
            </div>

            {/* MODAL Review */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                            <h3 className="text-xl font-bold text-slate-900">Chi tiết lựa chọn</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X /></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 space-y-6">
                            {criteriaData.map(criterion => (
                                <div key={criterion.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {criterion.title}
                                    </h4>
                                    <div className="space-y-2">
                                        {criterion.options.map((opt) => {
                                            const isSelected = answers[criterion.id] === opt.stars;
                                            return (
                                                <button
                                                    key={opt.stars}
                                                    onClick={() => {
                                                        onUpdateAnswer(criterion.id, opt.stars);
                                                    }}
                                                    className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3
                                                        ${isSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}
                                                    `}
                                                >
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${isSelected ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'}`}>
                                                        {opt.stars}
                                                    </div>
                                                    <p className={`text-xs font-bold leading-relaxed flex-1 ${isSelected ? 'text-blue-900' : 'text-slate-500'}`}>{opt.desc}</p>
                                                    {isSelected && <CheckCircle2 className="text-blue-500 w-5 h-5 flex-shrink-0" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-white border-t border-slate-100">
                            <button onClick={() => setIsModalOpen(false)} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl">XÁC NHẬN VÀ ĐÓNG</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
