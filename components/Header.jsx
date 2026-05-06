import React from 'react';
import { Map, LogIn, LogOut, History as HistoryIcon } from 'lucide-react';

export default function Header({ step, currentQIndex, totalQuestions, user, onLogin, onLogout, onOpenHistory }) {
    return (
        <header className="bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-2">
                <Map className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-lg tracking-tight">K-Edu Radar</span>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6">
                {step > 0 && step < 2 && (
                    <div className="text-sm font-medium text-slate-500 hidden sm:block">
                        Tiêu chí {currentQIndex + 1}/{totalQuestions}
                    </div>
                )}
                
                <button
                    onClick={onOpenHistory}
                    className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition-colors"
                >
                    <HistoryIcon size={16} /> <span className="hidden sm:inline">Lịch sử</span>
                </button>

                {user ? (
                    <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                        <div className="flex items-center gap-2">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-200" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                    {user.email ? user.email[0].toUpperCase() : 'U'}
                                </div>
                            )}
                            <div className="flex flex-col items-start hidden sm:flex">
                                <span className="text-sm font-bold text-slate-700 leading-tight">
                                    {user.displayName || user.email?.split('@')[0]}
                                </span>
                                {user.profile?.level && (
                                    <span 
                                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-0.5 flex items-center gap-1 leading-none"
                                        style={{ backgroundColor: user.profile.level.bg, color: user.profile.level.color }}
                                    >
                                        <span className="text-[10px]">{user.profile.level.icon}</span> {user.profile.level.name}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button 
                            onClick={onLogout}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Đăng xuất"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={onLogin}
                        className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-colors ml-2"
                    >
                        <LogIn size={16} /> Đăng nhập
                    </button>
                )}
            </div>
        </header>
    );
}
