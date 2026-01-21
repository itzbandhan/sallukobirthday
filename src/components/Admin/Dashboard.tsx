import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { SettingsTab } from './SettingsTab';
import { RecipientsTab } from './RecipientsTab';
import { LogOut, Settings, Users } from 'lucide-react';
import { clsx } from 'clsx';

export const Dashboard = () => {
    const [activeTab, setActiveTab] = useState<'settings' | 'recipients'>('settings');

    const handleLogout = () => {
        supabase.auth.signOut();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800">✉️ Invitation Admin</h1>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-500 transition-colors"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </header>

            {/* Content */}
            <div className="flex-1 container mx-auto p-6 max-w-5xl">

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={clsx(
                            "pb-4 px-2 flex items-center gap-2 font-medium transition-colors border-b-2",
                            activeTab === 'settings'
                                ? "border-brand-pink text-brand-dark"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <Settings size={20} />
                        Settings
                    </button>
                    <button
                        onClick={() => setActiveTab('recipients')}
                        className={clsx(
                            "pb-4 px-2 flex items-center gap-2 font-medium transition-colors border-b-2",
                            activeTab === 'recipients'
                                ? "border-brand-pink text-brand-dark"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <Users size={20} />
                        Recipients
                    </button>
                </div>

                {/* Tab Panels */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    {activeTab === 'settings' ? <SettingsTab /> : <RecipientsTab />}
                </div>

            </div>
        </div>
    );
};
