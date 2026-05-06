import React from 'react';
import { Lock, ShieldAlert, LogOut } from 'lucide-react';

export default function AdminLogin({ onLogin, user, onLogout }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md text-center animate-in fade-in zoom-in-95 duration-300">
                {user ? (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center border-4 border-red-50">
                                <ShieldAlert className="w-10 h-10" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Quyền truy cập bị từ chối</h2>
                        <p className="text-slate-500 mb-6 font-medium">
                            Tài khoản <span className="font-bold text-slate-800">{user.email}</span> của bạn không có quyền Quản trị viên (Admin) để truy cập vào khu vực này.
                        </p>
                        
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => window.location.hash = '#/'}
                                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                            >
                                Quay lại Trang chủ
                            </button>
                            <button 
                                onClick={onLogout}
                                className="w-full flex justify-center items-center gap-2 py-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors"
                            >
                                <LogOut className="w-5 h-5" /> Đăng xuất tài khoản này
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center border-4 border-blue-50">
                                <Lock className="w-10 h-10" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">K-Edu Radar Admin</h2>
                        <p className="text-slate-500 mb-8 font-medium">Khu vực dành riêng cho Ban Quản Trị Hệ Thống. Vui lòng đăng nhập để tiếp tục.</p>
                        
                        <button 
                            onClick={onLogin}
                            className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-700 font-bold rounded-xl transition-all shadow-sm"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                            Đăng nhập bằng Google
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
