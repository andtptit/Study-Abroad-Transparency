import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function BasicInfoStep({ centerName, setCenterName, price, setPrice, onStart }) {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
                Định vị Trung tâm Du học<br />bạn đang tìm hiểu
            </h1>
            <p className="text-slate-500 mb-8 text-lg">
                Trả lời vài câu hỏi để xem trung tâm bạn định chọn là "Mercedes" hay "KIA" trong ngành, và có rủi ro tiềm ẩn nào không.
            </p>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tên trung tâm (Không bắt buộc)</label>
                    <input
                        type="text"
                        placeholder="VD: ABC Education..."
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        value={centerName}
                        onChange={(e) => setCenterName(e.target.value)}
                    />
                </div>

                <div>
                    <div className="flex justify-between items-end mb-2">
                        <label className="block text-sm font-bold text-slate-700">Tổng chi phí họ báo cho bạn?</label>
                        <span className="text-2xl font-black text-blue-600">{price} <span className="text-sm font-normal text-slate-500">Triệu VNĐ</span></span>
                    </div>
                    <input
                        type="range"
                        min="0" max="130" step="5"
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                        <span>0đ</span>
                        <span>40tr</span>
                        <span>65tr</span>
                        <span>90tr</span>
                        <span>130tr+</span>
                    </div>
                </div>

                <button
                    onClick={onStart}
                    className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 group mt-4 shadow-lg shadow-blue-200"
                >
                    Bắt đầu đánh giá
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
