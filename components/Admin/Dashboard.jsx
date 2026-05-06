import React, { useState, useEffect, useMemo } from 'react';
import { db, logoutAdmin, fetchGeneralSettings, updateGeneralSettings, toggleAdminVerify } from '../../firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { LogOut, Plus, Edit2, Trash2, Save, X, LayoutDashboard, AlertCircle, RefreshCw, Layers, Building2, Settings, ShieldCheck, Search } from 'lucide-react';

export default function AdminDashboard({ onLogout }) {
    const [criteria, setCriteria] = useState([]);
    const [centers, setCenters] = useState([]);
    const [evaluations, setEvaluations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    
    const [activeTab, setActiveTab] = useState('criteria');
    const [newCenterName, setNewCenterName] = useState('');
    
    // Scanner
    const [scannerSearch, setScannerSearch] = useState('');
    
    const unstandardizedCenters = useMemo(() => {
        const standardNames = centers.map(c => c.name.toLowerCase());
        const issues = {};
        evaluations.forEach(ev => {
            const evName = ev.centerName || '';
            if (evName && !standardNames.includes(evName.toLowerCase())) {
                if (!issues[evName]) issues[evName] = 0;
                issues[evName]++;
            }
        });
        return Object.keys(issues).map(name => ({
            name,
            count: issues[name]
        })).sort((a, b) => b.count - a.count);
    }, [centers, evaluations]);

    // Settings
    const [settings, setSettings] = useState({ minLikesForQuality: 20 });
    const [isSavingSettings, setIsSavingSettings] = useState(false);

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

            const qCenters = query(collection(db, "centers"), orderBy("name", "asc"));
            const centersSnapshot = await getDocs(qCenters);
            const centersData = [];
            centersSnapshot.forEach((doc) => {
                centersData.push({ id: doc.id, ...doc.data() });
            });
            setCenters(centersData);

            // Fetch Evaluations
            const qEvals = query(collection(db, "evaluations"), orderBy("createdAt", "desc"));
            const evalsSnapshot = await getDocs(qEvals);
            const evalsData = [];
            evalsSnapshot.forEach((doc) => {
                evalsData.push({ id: doc.id, ...doc.data() });
            });
            setEvaluations(evalsData);

            // Fetch Settings
            const loadedSettings = await fetchGeneralSettings();
            setSettings(loadedSettings);
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

    const handleSaveSettings = async () => {
        setIsSavingSettings(true);
        await updateGeneralSettings(settings);
        setIsSavingSettings(false);
        alert('Đã lưu cấu hình thành công!');
    };

    const handleToggleVerify = async (evalId, currentStatus) => {
        const newStatus = !currentStatus;
        setEvaluations(prev => prev.map(ev => ev.id === evalId ? { ...ev, isAdminVerified: newStatus } : ev));
        await toggleAdminVerify(evalId, newStatus);
    };

    const handleUpdateSingleCenterName = async (evalId, currentName) => {
        const newName = window.prompt("Nhập tên trung tâm mới:", currentName);
        if (!newName || newName.trim() === "" || newName === currentName) return;
        
        // Update UI Optimistically
        setEvaluations(prev => prev.map(ev => ev.id === evalId ? { ...ev, centerName: newName.trim() } : ev));
        
        // Cần import hàm từ firebase
        const { updateEvaluationCenterName } = await import('../../firebase');
        await updateEvaluationCenterName(evalId, newName.trim());
    };

    const [bulkOldName, setBulkOldName] = useState('');
    const [bulkNewName, setBulkNewName] = useState('');
    const [isBulking, setIsBulking] = useState(false);

    const handleBulkUpdate = async () => {
        if (!bulkOldName || !bulkNewName) {
            alert("Vui lòng nhập đủ tên cũ và tên mới!");
            return;
        }
        if (!window.confirm(`Bạn có chắc muốn đổi TẤT CẢ đánh giá từ "${bulkOldName}" thành "${bulkNewName}" không?`)) return;
        
        setIsBulking(true);
        const { bulkUpdateCenterName } = await import('../../firebase');
        const count = await bulkUpdateCenterName(bulkOldName.trim(), bulkNewName.trim());
        
        if (count > 0) {
            alert(`Đã gộp thành công ${count} bài đánh giá!`);
            // Reset form
            setBulkOldName('');
            setBulkNewName('');
            // Reload data
            loadData();
        } else if (count === 0) {
            alert("Không tìm thấy bài đánh giá nào có tên cũ này.");
        } else {
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
        setIsBulking(false);
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

    const handleAddCenter = async (e) => {
        e.preventDefault();
        if (!newCenterName.trim()) return;
        setIsSaving(true);
        try {
            const docRef = await addDoc(collection(db, "centers"), {
                name: newCenterName.trim(),
                createdAt: serverTimestamp()
            });
            setCenters([...centers, { id: docRef.id, name: newCenterName.trim() }].sort((a,b) => a.name.localeCompare(b.name)));
            setNewCenterName('');
        } catch(e) {
            alert("Lỗi khi thêm trung tâm: " + e.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteCenter = async (id, name) => {
        if (!window.confirm(`Bạn có chắc muốn xóa trung tâm "${name}" không?`)) return;
        try {
            await deleteDoc(doc(db, "centers", id));
            setCenters(centers.filter(c => c.id !== id));
        } catch(e) {
            alert("Lỗi khi xóa: " + e.message);
        }
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

                {/* TABS */}
                {!editingItem && (
                    <div className="flex flex-wrap gap-4 mb-8">
                        <button 
                            onClick={() => setActiveTab('criteria')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'criteria' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}`}
                        >
                            <Layers className="w-5 h-5" /> Tiêu chí đánh giá
                        </button>
                        <button 
                            onClick={() => setActiveTab('centers')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'centers' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}`}
                        >
                            <Building2 className="w-5 h-5" /> Danh sách Trung tâm
                        </button>
                        <button 
                            onClick={() => setActiveTab('evaluations')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'evaluations' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Dữ liệu Đánh giá
                        </button>
                        <button 
                            onClick={() => setActiveTab('settings')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}`}
                        >
                            <Settings className="w-5 h-5" /> Cài đặt chung
                        </button>
                    </div>
                )}

                {activeTab === 'criteria' && (
                    !editingItem ? (
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
                    )
                )}

                {activeTab === 'centers' && !editingItem && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                        Trung tâm đã chuẩn hóa <span className="bg-blue-100 text-blue-700 text-xs py-1 px-2 rounded-lg font-black">{centers.length}</span>
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">Danh sách này sẽ hiển thị ở ô gợi ý khi người dùng nhập thông tin.</p>
                                </div>
                                <form onSubmit={handleAddCenter} className="flex gap-2 w-full sm:w-auto">
                                    <input 
                                        type="text" 
                                        placeholder="Tên trung tâm mới..." 
                                        value={newCenterName}
                                        onChange={(e) => setNewCenterName(e.target.value)}
                                        className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl outline-none focus:border-blue-500 font-medium w-full sm:w-64"
                                    />
                                    <button type="submit" disabled={isSaving || !newCenterName.trim()} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-xl disabled:opacity-50 shrink-0">
                                        {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Thêm
                                    </button>
                                </form>
                            </div>
                            
                            <div className="p-6">
                                {isLoading ? (
                                    <div className="py-10 text-center text-slate-500 font-bold flex items-center justify-center gap-2">
                                        <RefreshCw className="w-5 h-5 animate-spin" /> Đang tải...
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {centers.map(center => (
                                            <div key={center.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-xl group hover:border-blue-300 transition-colors">
                                                <span className="font-bold text-slate-700 truncate mr-2" title={center.name}>{center.name}</span>
                                                <button onClick={() => handleDeleteCenter(center.id, center.name)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {centers.length === 0 && (
                                            <div className="col-span-full py-10 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
                                                Chưa có trung tâm nào.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* --- SCANNER SECTION --- */}
                        <div className="mt-8 bg-amber-50/50 rounded-3xl border border-amber-200 overflow-hidden">
                            <div className="p-6 border-b border-amber-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                                        Trình Quét Dữ liệu Rác
                                        {unstandardizedCenters.length > 0 && (
                                            <span className="bg-amber-500 text-white text-xs py-1 px-2 rounded-lg font-black">
                                                Phát hiện {unstandardizedCenters.length} tên
                                            </span>
                                        )}
                                    </h2>
                                    <p className="text-sm text-amber-700/80 mt-1">Danh sách các tên trung tâm người dùng tự nhập không có trong CSDL chuẩn.</p>
                                </div>
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Tìm tên rác..." 
                                        value={scannerSearch}
                                        onChange={(e) => setScannerSearch(e.target.value)}
                                        className="w-full bg-white border border-amber-200 pl-10 pr-4 py-2 rounded-xl outline-none focus:border-amber-500 font-medium text-amber-900 text-sm"
                                    />
                                </div>
                            </div>
                            
                            <div className="p-0">
                                {unstandardizedCenters.length === 0 ? (
                                    <div className="p-10 text-center text-amber-600 font-medium">
                                        <ShieldCheck className="w-12 h-12 text-amber-300 mx-auto mb-3" />
                                        Dữ liệu rất sạch sẽ! Không phát hiện tên tự nhập nào.
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-amber-100/50 max-h-96 overflow-y-auto">
                                        {unstandardizedCenters
                                            .filter(c => c.name.toLowerCase().includes(scannerSearch.toLowerCase()))
                                            .map((item, idx) => (
                                            <li key={idx} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-amber-100/30 transition-colors">
                                                <div>
                                                    <span className="font-bold text-amber-900 line-through decoration-amber-300 decoration-2">{item.name || '(Trống)'}</span>
                                                    <span className="ml-2 text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">{item.count} bài đánh giá</span>
                                                </div>
                                                <div className="flex gap-2 w-full md:w-auto">
                                                    <select 
                                                        onChange={(e) => {
                                                            if(e.target.value) {
                                                                setBulkOldName(item.name);
                                                                setBulkNewName(e.target.value);
                                                            }
                                                        }}
                                                        className="flex-1 md:w-48 bg-white border border-amber-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-amber-500 font-medium text-slate-700"
                                                    >
                                                        <option value="">-- Chọn tên chuẩn --</option>
                                                        {centers.map(c => (
                                                            <option key={c.id} value={c.name}>{c.name}</option>
                                                        ))}
                                                    </select>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Hoặc gõ tên chuẩn mới"
                                                        onChange={(e) => {
                                                            setBulkOldName(item.name);
                                                            setBulkNewName(e.target.value);
                                                        }}
                                                        className="flex-1 md:w-48 bg-white border border-amber-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-amber-500 font-medium text-slate-700"
                                                    />
                                                    <button 
                                                        onClick={handleBulkUpdate}
                                                        disabled={isBulking || bulkOldName !== item.name || !bulkNewName.trim()} 
                                                        className="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 font-bold rounded-lg disabled:opacity-50 transition-all text-sm shrink-0 flex items-center gap-2"
                                                    >
                                                        {isBulking && bulkOldName === item.name ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Gộp'}
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                    </div>
                )}

                {activeTab === 'evaluations' && !editingItem && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                        Lịch sử đánh giá <span className="bg-blue-100 text-blue-700 text-xs py-1 px-2 rounded-lg font-black">{evaluations.length}</span>
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">Toàn bộ dữ liệu khảo sát từ người dùng.</p>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-bold tracking-wider">
                                            <th className="p-4 pl-6">Thời gian</th>
                                            <th className="p-4">Trung tâm</th>
                                            <th className="p-4">Phân khúc</th>
                                            <th className="p-4">Điểm</th>
                                            <th className="p-4">Chi phí</th>
                                            <th className="p-4">Trạng thái user</th>
                                            <th className="p-4">Lượt thích</th>
                                            <th className="p-4 pr-6">Chất lượng</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {evaluations.map(ev => (
                                            <tr key={ev.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="p-4 pl-6 text-sm font-medium text-slate-500">
                                                    {ev.createdAt ? new Date(ev.createdAt.seconds * 1000).toLocaleString('vi-VN') : 'N/A'}
                                                </td>
                                                <td className="p-4 text-sm font-bold text-slate-800">
                                                    <div className="flex items-center gap-2 group">
                                                        <span className="truncate max-w-[150px]">{ev.centerName || 'Ẩn danh'}</span>
                                                        <button 
                                                            onClick={() => handleUpdateSingleCenterName(ev.id, ev.centerName || '')} 
                                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                                            title="Sửa tên trung tâm"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                                                        ev.segment === 'premium' ? 'bg-blue-100 text-blue-700' :
                                                        ev.segment === 'value' ? 'bg-green-100 text-green-700' :
                                                        ev.segment === 'warning' ? 'bg-red-100 text-red-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        {ev.segment === 'premium' ? 'Cao cấp' : ev.segment === 'value' ? 'Thông minh' : ev.segment === 'warning' ? 'Rủi ro' : 'Phổ thông'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm font-bold text-slate-800">
                                                    {ev.finalScore} ⭐
                                                </td>
                                                <td className="p-4 text-sm font-medium text-slate-600">
                                                    {ev.price}tr
                                                </td>
                                                <td className="p-4">
                                                    {ev.isAnonymous ? (
                                                        <span className="text-slate-400 text-xs font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Ẩn danh</span>
                                                    ) : (
                                                        <div className="flex flex-col">
                                                            <span className="text-blue-600 text-xs font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Đã xác thực</span>
                                                            <span className="text-[10px] font-medium text-slate-500 truncate max-w-[100px]">{ev.userDisplayName}</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4 text-sm font-bold text-slate-600">
                                                    ❤️ {ev.likesCount || 0}
                                                </td>
                                                <td className="p-4 pr-6">
                                                    <button 
                                                        onClick={() => handleToggleVerify(ev.id, ev.isAdminVerified)}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${ev.isAdminVerified ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                                    >
                                                        <ShieldCheck className={`w-4 h-4 ${ev.isAdminVerified ? 'text-blue-600' : 'text-slate-400'}`} />
                                                        {ev.isAdminVerified ? 'Đã duyệt' : 'Duyệt'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {evaluations.length === 0 && !isLoading && (
                                    <div className="py-20 text-center text-slate-500 font-medium">
                                        Chưa có lượt đánh giá nào.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden p-6 max-w-2xl mx-auto">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                                    <Settings className="w-6 h-6 text-slate-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Cài đặt Thuật toán</h2>
                                    <p className="text-sm text-slate-500 mt-1">Cấu hình các bộ lọc và hiển thị trên bảng tin cộng đồng.</p>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                                    <h3 className="font-bold text-slate-800 mb-2">Điều kiện Lọc "Đánh giá Chất lượng"</h3>
                                    <p className="text-sm text-slate-500 mb-4">Nhập số lượt Tim (Likes) tối thiểu để một bài đánh giá tự động vượt qua bộ lọc chất lượng trên bảng tin (không cần Admin duyệt tay).</p>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                value={settings.minLikesForQuality}
                                                onChange={(e) => setSettings({ ...settings, minLikesForQuality: parseInt(e.target.value) || 0 })}
                                                className="w-32 bg-white border-2 border-slate-200 pl-4 pr-4 py-2.5 rounded-xl outline-none focus:border-blue-500 font-bold text-slate-800"
                                                min="0"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Tim</span>
                                        </div>
                                        <button 
                                            onClick={handleSaveSettings}
                                            disabled={isSavingSettings}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl transition-all"
                                        >
                                            {isSavingSettings ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                            {isSavingSettings ? 'Đang lưu...' : 'Lưu cài đặt'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
