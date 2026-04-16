import React from 'react';
import { Map } from 'lucide-react';

export default function Header({ step, currentQIndex, totalQuestions }) {
    return (
        <header className="bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-2">
                <Map className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-lg tracking-tight">K-Edu Radar</span>
            </div>
            {step > 0 && step < 2 && (
                <div className="text-sm font-medium text-slate-500">
                    Tiêu chí {currentQIndex + 1}/{totalQuestions}
                </div>
            )}
        </header>
    );
}
