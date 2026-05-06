import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function BasicInfoStep({ centerName, setCenterName, price, setPrice, onStart, centersList = [] }) {
    const [isOther, setIsOther] = useState(false);

    // Sync state if centerName is pre-filled (e.g. going back from step 1)
    useEffect(() => {
        if (centerName && !centersList.find(c => c.name === centerName)) {
            setIsOther(true);
        }
    }, []);

    const handleSelectChange = (e) => {
        const val = e.target.value;
        if (val === 'OTHER') {
            setIsOther(true);
            setCenterName('');
        } else {
            setIsOther(false);
            setCenterName(val);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
                Định vị Trung tâm Du học<br />bạn đang tìm hiểu
            </h1>
            <p className="text-slate-500 mb-8 text-lg">
                Với mong muốn <span className="font-bold text-blue-600">Minh bạch hóa thị trường du học</span>, công cụ này giúp bạn đối chiếu trung tâm đang tìm hiểu với những quy chuẩn chất lượng khắt khe nhất. Đừng đặt bút ký khi bạn chưa hiểu rõ!
            </p>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tên trung tâm bạn đang tìm hiểu?</label>
                    <div className="space-y-3">
                        <select
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium text-slate-700 appearance-none cursor-pointer"
                            value={isOther ? 'OTHER' : centerName}
                            onChange={handleSelectChange}
                        >
                            <option value="" disabled>-- Chọn từ danh sách --</option>
                            {centersList.map(c => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                            <option value="OTHER">✨ Khác (Tự nhập tên trung tâm)</option>
                        </select>
                        
                        {isOther && (
                            <input
                                type="text"
                                placeholder="Nhập tên trung tâm của bạn..."
                                className="w-full p-4 bg-white border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none animate-in slide-in-from-top-2"
                                value={centerName}
                                onChange={(e) => setCenterName(e.target.value)}
                                autoFocus
                            />
                        )}
                    </div>
                </div>

                <div className="relative">
                    <div className="flex justify-between items-end mb-4">
                        <label className="block text-sm font-bold text-slate-700 uppercase tracking-tight">Tổng chi phí họ báo cho bạn?</label>
                        <div className="text-right">
                            <span className={`text-3xl font-black transition-colors ${price === 39 ? 'text-amber-500' : 'text-blue-600'}`}>{price}</span>
                            <span className="text-sm font-bold text-slate-500 ml-1">Triệu VNĐ</span>
                        </div>
                    </div>

                    <div className="relative px-1 pt-2 pb-2">
                        <input
                            type="range"
                            min="0" max="130" step="1"
                            className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer transition-all duration-300 relative z-20 
                                ${price === 39 ? 'accent-amber-500 scale-y-110' : 'accent-blue-600'}
                            `}
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                        />

                        {/* Ticks positioned mathematically */}
                        <div className="relative h-6 mt-4">
                            {[0, 39, 65, 90, 130].map((val) => {
                                const isCurrent = price === val;
                                const isSpecial = val === 39;
                                return (
                                    <span
                                        key={val}
                                        className={`absolute -translate-x-1/2 text-[10px] font-bold transition-all duration-300 
                                            ${isCurrent ? (isSpecial ? 'text-amber-600 scale-125' : 'text-blue-600 scale-110') : 'text-slate-400'}
                                            ${isSpecial ? 'text-amber-500 font-black' : ''}
                                        `}
                                        style={{ left: `${(val / 130) * 100}%` }}
                                    >
                                        {val === 0 ? '0đ' : val === 130 ? '130tr+' : `${val}tr`}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <button
                    onClick={onStart}
                    disabled={!centerName.trim()}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 group mt-4 
                        ${centerName.trim() ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                    `}
                >
                    Bắt đầu đánh giá
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
