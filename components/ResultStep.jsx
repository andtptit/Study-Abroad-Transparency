import React, { useMemo, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LabelList, Cell, Label } from 'recharts';
import { AlertTriangle, CheckCircle2, RotateCcw, ClipboardList, X } from 'lucide-react';

export default function ResultStep({ centerName, price, answers, onReset, onUpdateAnswer, criteriaData }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const calculateResult = useMemo(() => {
        if (Object.keys(answers).length === 0) return { x: 3, y: 65, status: 'unknown' };

        // Tính trung bình cộng điểm chất lượng (Trục X) CÓ TRỌNG SỐ
        const totalWeight = criteriaData.reduce((acc, curr) => acc + (curr.weight || 1.0), 0);
        const totalScore = criteriaData.reduce((acc, curr) => {
            const star = answers[curr.id] || 0;
            return acc + (star * (curr.weight || 1.0));
        }, 0);
        
        const averageScore = totalWeight > 0 ? (totalScore / totalWeight) : 0;

        // Định danh nhóm dựa trên tọa độ
        let status = '';
        let statusTitle = '';
        let statusDesc = '';
        let color = '';

        if (averageScore >= 3 && price >= 65) {
            status = 'premium';
            statusTitle = 'Phân khúc Premium';
            statusDesc = 'Chất lượng cao đi kèm mức giá cao. Dành cho những ai cần sự an tâm tuyệt đối, dịch vụ trọn gói từ A-Z.';
            color = '#3b82f6'; // blue
        } else if (averageScore >= 3 && price < 65) {
            status = 'value';
            statusTitle = 'Lựa chọn Quốc Dân';
            statusDesc = 'Ngon - Bổ - Rẻ! Trung tâm có chất lượng tốt nhưng tối ưu được chi phí vận hành nên mức phí rất cạnh tranh.';
            color = '#22c55e'; // green
        } else if (averageScore < 3 && price >= 65) {
            status = 'warning';
            statusTitle = 'CẢNH BÁO RED FLAG';
            statusDesc = 'Chất lượng dịch vụ thấp nhưng thu phí rất cao (hoặc có nhiều phụ phí ẩn). Hãy cẩn thận bị "Lùa gà"!';
            color = '#ef4444'; // red
        } else {
            status = 'cheap';
            statusTitle = 'Phân khúc Giá Rẻ';
            statusDesc = 'Chi phí thấp nhưng dịch vụ lỏng lẻo, nhiều rủi ro bị "đem con bỏ chợ". Tiền nào của nấy.';
            color = '#f59e0b'; // amber
        }

        return {
            x: Number(averageScore.toFixed(2)),
            y: price,
            status,
            statusTitle,
            statusDesc,
            color
        };
    }, [answers, price, criteriaData]);

    const chartData = [{
        name: centerName || 'Trung tâm bạn chọn',
        x: calculateResult.x,
        y: calculateResult.y,
        fill: calculateResult.color
    }];

    const CustomTooltipChart = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-100">
                    <p className="font-bold text-slate-800 text-lg mb-1">{data.name}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="font-medium w-24">Chất lượng:</span>
                        <span className="text-amber-500 font-bold">{data.x} ⭐</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                        <span className="font-medium w-24">Tổng chi phí:</span>
                        <span className="font-bold">{data.y} Triệu VNĐ</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="animate-in fade-in zoom-in-95 duration-500">
            {/* Header Kết quả */}
            <div className="text-center mb-10 max-w-2xl mx-auto">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: `${calculateResult.color}20` }}>
                    {calculateResult.status === 'warning' ? <AlertTriangle size={40} color={calculateResult.color} /> : <CheckCircle2 size={40} color={calculateResult.color} />}
                </div>
                <h2 className="text-3xl font-extrabold mb-4">Kết quả định vị</h2>
                <p className="text-lg text-slate-600">
                    Dựa trên thông tin, <span className="font-bold text-slate-900">{centerName}</span> được xếp vào:
                </p>
                <div className="mt-4 p-6 rounded-2xl border" style={{ backgroundColor: `${calculateResult.color}10`, borderColor: `${calculateResult.color}30` }}>
                    <h3 className="text-2xl font-black mb-2" style={{ color: calculateResult.color }}>{calculateResult.statusTitle}</h3>
                    <p className="text-slate-700 font-medium">{calculateResult.statusDesc}</p>
                </div>
            </div>

            {/* Khu vực Biểu Đồ */}
            <div className="bg-white p-4 sm:p-8 rounded-3xl shadow-xl border border-slate-200 relative overflow-hidden">
                <h3 className="font-bold text-slate-800 text-xl mb-6 text-center">Bản đồ định vị thương hiệu</h3>

                <div className="w-full aspect-square sm:aspect-[4/3] max-h-[600px] relative">
                    <div className="absolute inset-0 z-0 grid grid-cols-2 grid-rows-2 opacity-40 pointer-events-none p-12">
                        <div className="flex items-start justify-start p-4 border-r-2 border-b-2 border-dashed border-slate-200">
                            <span className="font-bold text-red-500 text-lg uppercase">⚠️ Cảnh báo Lùa gà<br /><span className="text-sm font-medium text-slate-400 capitalize">Giá ảo, Chất lượng thấp</span></span>
                        </div>
                        <div className="flex items-start justify-end p-4 border-b-2 border-dashed border-slate-200 text-right">
                            <span className="font-bold text-blue-500 text-lg uppercase">💎 Premium<br /><span className="text-sm font-medium text-slate-400 capitalize">Chất lượng cao, Giá cao</span></span>
                        </div>
                        <div className="flex items-end justify-start p-4 border-r-2 border-dashed border-slate-200">
                            <span className="font-bold text-amber-500 text-lg uppercase">Nguy cơ rủi ro<br /><span className="text-sm font-medium text-slate-400 capitalize">Giá rẻ, Thiếu trách nhiệm</span></span>
                        </div>
                        <div className="flex items-end justify-end p-4 text-right">
                            <span className="font-bold text-green-500 text-lg uppercase">⭐ Lựa chọn Quốc dân<br /><span className="text-sm font-medium text-slate-400 capitalize">Giá tốt, Dịch vụ chuẩn</span></span>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            
                            <XAxis
                                type="number"
                                dataKey="x"
                                name="Chất lượng"
                                domain={[1, 5]}
                                ticks={[1, 2, 3, 4, 5]}
                                tick={{ fill: '#64748b', fontWeight: 600 }}
                                axisLine={{ stroke: '#cbd5e1', strokeWidth: 2 }}
                            >
                                <Label value="Chất lượng dịch vụ (Đánh giá theo sao)" offset={-15} position="insideBottom" style={{ fill: '#64748b', fontWeight: 'bold' }} />
                            </XAxis>

                            <YAxis
                                type="number"
                                dataKey="y"
                                name="Chi phí"
                                domain={[0, 130]}
                                ticks={[0, 20, 40, 65, 90, 110, 130]}
                                tick={{ fill: '#64748b', fontWeight: 600 }}
                                axisLine={{ stroke: '#cbd5e1', strokeWidth: 2 }}
                            >
                                <Label value="Tổng chi phí (Triệu VNĐ)" angle={-90} position="insideLeft" style={{ fill: '#64748b', fontWeight: 'bold' }} />
                            </YAxis>

                            <Tooltip content={<CustomTooltipChart />} cursor={{ strokeDasharray: '3 3' }} />

                            <ReferenceLine x={3} stroke="#94a3b8" strokeWidth={2} opacity={0.5} />
                            <ReferenceLine y={65} stroke="#94a3b8" strokeWidth={2} opacity={0.5} />

                            <Scatter name="Trung tâm" data={chartData} shape="circle">
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                                <LabelList
                                    dataKey="name"
                                    position="top"
                                    offset={15}
                                    style={{ fill: '#0f172a', fontWeight: 'bold', fontSize: '14px', textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}
                                />
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="py-4 px-8 bg-blue-50 text-blue-600 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-100 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                    <ClipboardList className="w-5 h-5" /> Xem lại lựa chọn
                </button>
                <button
                    onClick={onReset}
                    className="py-4 px-8 bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                    <RotateCcw className="w-5 h-5" /> Đánh giá trung tâm khác
                </button>
            </div>

            {/* MODAL Xem & Phản hồi Lựa Chọn */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-3xl z-10 shrink-0">
                            <div>
                                <h3 className="text-xl font-extrabold flex items-center gap-2 text-slate-900">
                                    <ClipboardList className="text-blue-600" /> Xem và Điều chỉnh Lựa chọn
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">Bấm vào các tùy chọn bên dưới để thay đổi kết quả (mức chi phí giữ nguyên: {price}tr)</p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1 space-y-8 bg-slate-50/50 rounded-b-3xl">
                            {criteriaData.map(criterion => (
                                <div key={criterion.id}>
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-bold text-slate-800">{criterion.title}</h4>
                                        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-md font-bold">Trọng số: x{criterion.weight}</span>
                                    </div>
                                    <div className="space-y-2">
                                        {criterion.options.map((opt) => {
                                            const isSelected = answers[criterion.id] === opt.stars;
                                            return (
                                                <button
                                                    key={opt.stars}
                                                    onClick={() => onUpdateAnswer(criterion.id, opt.stars)}
                                                    className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-start gap-3 group
                                                        ${isSelected 
                                                            ? 'border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-500/20' 
                                                            : 'border-white bg-white hover:border-blue-200 hover:bg-blue-50/50 shadow-sm'
                                                        }
                                                    `}
                                                >
                                                    <div className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg shrink-0 font-bold ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                                                        {opt.stars}<span className="text-[8px] uppercase -mt-0.5">Sao</span>
                                                    </div>
                                                    <div className="pt-0.5">
                                                        <p className={`text-sm font-medium leading-relaxed ${isSelected ? 'text-blue-900' : 'text-slate-600'}`} style={{ whiteSpace: 'pre-line'}}>{opt.desc}</p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-end pt-4">
                                <button 
                                    onClick={() => setIsModalOpen(false)} 
                                    className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800"
                                >
                                    Đóng & Cập nhật
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
