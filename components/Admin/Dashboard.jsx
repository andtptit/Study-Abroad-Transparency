import React, { useState, useEffect } from 'react';
import { db, logoutAdmin } from '../../firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { LogOut, Plus, Edit2, Trash2, Save, X, LayoutDashboard, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminDashboard({ onLogout }) {
    const [criteria, setCriteria] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const q = query(collection(db, "radar_criteria"), orderBy("order", "asc"));
            const querySnapshot = await getDocs(q);
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push({ ...doc.data() });
            });
            setCriteria(data);
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu Admin:", err);
            alert("Không thể tải cấu hình từ Firebase. Kiểm tra lại quyền Firestore.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleLogout = async () => {
        await logoutAdmin();
        onLogout();
    };

    const handleAddNew = () => {
        const newId = `criterion_${Date.now()}`;
        setEditingItem({
            id: newId,
            order: criteria.length + 1,
            title: "Tiêu chí mới",
            question: "Câu hỏi cho tiêu chí mới?",
            weight: 1.0,
            options: [1, 2, 3, 4, 5].map(star => ({ stars: star, desc: "" }))
        });
    };

    const handleEdit = (item) => {
        // Đảm bảo đủ 5 option
        let opts = item.options || [];
        if (opts.length < 5) {
            opts = [1, 2, 3, 4, 5].map(star => {
                const existing = opts.find(o => o.stars === star);
                return existing ? existing : { stars: star, desc: "" };
            });
        }
        setEditingItem({ ...item, options: opts });
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Bạn có chắc muốn XÓA vĩnh viễn tiêu chí "${title}" không?`)) return;
        try {
            await deleteDoc(doc(db, "radar_criteria", id));
            setCriteria(criteria.filter(c => c.id !== id));
        } catch(e) {
            alert("Lỗi khi xóa: " + e.message);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Chuyển weight về số
            const payload = {
                ...editingItem,
                weight: parseFloat(editingItem.weight) || 1.0,
                order: parseInt(editingItem.order) || criteria.length + 1
            };
            await setDoc(doc(db, "radar_criteria", payload.id), payload);
            
            // Cập nhật state nội bộ
            setCriteria(prev => {
                const existing = prev.find(c => c.id === payload.id);
                if (existing) return prev.map(c => c.id === payload.id ? payload : c);
                return [...prev, payload];
            });
            setEditingItem(null);
        } catch(e) {
            alert("Lỗi khi lưu: " + e.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleOptionChange = (starMatched, newValue) => {
        const newOptions = editingItem.options.map(opt => 
            opt.stars === starMatched ? { ...opt, desc: newValue } : opt
        );
        setEditingItem({ ...editingItem, options: newOptions });
    };

    return (
        <div className="min-h-screen bg-slate-100 p-4 sm:p-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                            <LayoutDashboard className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800">Quản trị Hệ thống</h1>
                            <p className="text-slate-500 font-medium text-sm">Cấu hình thuật toán & Dữ liệu K-Edu Radar</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button onClick={loadData} className="p-3 bg-slate-50 text-slate-600 hover:bg-slate-200 rounded-xl transition-colors shrink-0">
                            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                        <button onClick={handleLogout} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl transition-colors">
                            <LogOut className="w-5 h-5" /> Đăng xuất
                        </button>
                    </div>
                </header>

                {!editingItem ? (
                    // --- LIST VIEW ---
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                Danh sách Tiêu chí <span className="bg-blue-100 text-blue-700 text-xs py-1 px-2 rounded-lg font-black">{criteria.length}</span>
                            </h2>
                            <button onClick={handleAddNew} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95">
                                <Plus className="w-5 h-5" /> Thêm tiêu chí mới
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="py-20 text-center font-bold text-slate-500 flex flex-col items-center gap-4">
                                <RefreshCw className="w-8 h-8 animate-spin" /> Đang lấy dữ liệu...
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {criteria.sort((a,b) => (a.order||0) - (b.order||0)).map((item) => (
                                    <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-blue-300 transition-colors">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="bg-slate-100 text-slate-500 text-xs font-black px-2 py-1 rounded">#{item.order}</span>
                                                <h3 className="font-extrabold text-lg text-slate-800">{item.title}</h3>
                                                <span className="bg-amber-100 text-amber-700 font-bold text-xs px-2 py-1 rounded-md ml-2 border border-amber-200">
                                                    Trọng số: {item.weight}
                                                </span>
                                            </div>
                                            <p className="text-slate-500 text-sm font-medium">{item.question}</p>
                                        </div>
                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <button onClick={() => handleEdit(item)} className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-slate-50 text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 font-bold rounded-xl transition-colors">
                                                <Edit2 className="w-4 h-4" /> Sửa
                                            </button>
                                            <button onClick={() => handleDelete(item.id, item.title)} className="p-2 sm:px-4 sm:py-2 bg-slate-50 text-red-500 hover:bg-red-50 border border-slate-200 hover:border-red-200 font-bold rounded-xl transition-colors">
                                                <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Xóa</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {criteria.length === 0 && (
                                    <div className="py-20 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                        Chưa có tiêu chí nào trên hệ thống.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    // --- EDITOR VIEW (MODAL LIKE BUT INLINE) ---
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-slate-50 border-b border-slate-200 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-slate-800">{editingItem.id.startsWith('criterion_') ? 'Thêm mới' : 'Chỉnh sửa'} Tiêu Chí</h2>
                            <button onClick={() => setEditingItem(null)} className="w-10 h-10 bg-white hover:bg-slate-200 border border-slate-200 rounded-full flex items-center justify-center text-slate-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-slate-700">Tên ngắn tiêu chí (Tên thẻ)</label>
                                    <input type="text" value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 font-medium" required />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-slate-700">Câu hỏi khảo sát dài hiển thị cho khách hàng</label>
                                    <input type="text" value={editingItem.question} onChange={e => setEditingItem({...editingItem, question: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 font-medium" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        Trọng số đánh giá (Weight)
                                        <div className="group relative">
                                            <AlertCircle className="w-4 h-4 text-amber-500" />
                                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-slate-800 text-white text-xs p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                                                Ví dụ: Nếu để 2.0, câu này sẽ ảnh hưởng gấp đôi câu để 1.0 đến kết quả cuối cùng.
                                            </div>
                                        </div>
                                    </label>
                                    <input type="number" step="0.1" min="0" value={editingItem.weight} onChange={e => setEditingItem({...editingItem, weight: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 font-medium" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Thứ tự hiển thị (Order)</label>
                                    <input type="number" value={editingItem.order} onChange={e => setEditingItem({...editingItem, order: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 font-medium" required />
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-bold text-slate-800 border-b-2 border-slate-100 pb-2 mb-4">Mô tả các mốc Sao (1 đến 5)</h3>
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map(starNum => {
                                        const opt = editingItem.options.find(o => o.stars === starNum) || { stars: starNum, desc: '' };
                                        return (
                                            <div key={starNum} className="flex gap-4 items-start">
                                                <div className="w-16 h-16 shrink-0 bg-slate-100 border-2 border-slate-200 rounded-xl flex flex-col items-center justify-center font-black text-slate-400 text-xl">
                                                    {starNum} <span className="text-[10px] uppercase block -mt-1 font-bold">Sao</span>
                                                </div>
                                                <textarea
                                                    value={opt.desc}
                                                    onChange={e => handleOptionChange(starNum, e.target.value)}
                                                    className="w-full h-24 bg-slate-50 border-2 border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 font-medium resize-none"
                                                    placeholder={`Mô tả chi tiết cho mức ${starNum} sao...`}
                                                    required
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex justify-end pt-6 border-t border-slate-100 gap-3">
                                <button type="button" onClick={() => setEditingItem(null)} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                                    Hủy bỏ
                                </button>
                                <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-70">
                                    {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
}
