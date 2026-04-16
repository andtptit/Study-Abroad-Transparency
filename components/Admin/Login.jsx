import React, { useState } from 'react';
import { loginAdmin } from '../../firebase';
import { Lock, Mail, KeyRound, Loader2 } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await loginAdmin(email, password);
            onLoginSuccess();
        } catch (err) {
            setError('Sai tài khoản hoặc mật khẩu! Vui lòng thử lại.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        <Lock className="w-8 h-8" />
                    </div>
                </div>
                
                <h2 className="text-2xl font-black text-center text-slate-900 mb-8">K-Edu Radar Admin</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-200 pl-12 pr-4 py-3 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                                placeholder="admin@minhbachduhoc.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Mật khẩu</label>
                        <div className="relative">
                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-200 pl-12 pr-4 py-3 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Đăng Nhập Quản Trị'}
                    </button>
                    
                    <div className="text-center mt-6">
                        <a href="#" onClick={() => window.location.hash = ''} className="text-slate-500 hover:text-blue-600 text-sm font-bold transition-colors">
                            ← Quay lại trang khảo sát
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
