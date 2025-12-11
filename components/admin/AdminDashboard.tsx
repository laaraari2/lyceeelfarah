import React, { useState } from 'react';
import type { AuthUser } from '../../services/authService';
import { Language } from '../../types';

interface AdminDashboardProps {
    user: AuthUser;
    language: Language;
    onLogout: () => void;
}

type AdminPage = 'dashboard' | 'users' | 'lessons' | 'news' | 'settings';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, language, onLogout }) => {
    const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');

    const menuItems = {
        ar: [
            { id: 'dashboard' as AdminPage, label: '📊 لوحة التحكم', icon: '📊' },
            { id: 'users' as AdminPage, label: '👥 المستخدمون', icon: '👥' },
            { id: 'lessons' as AdminPage, label: '📚 الدروس', icon: '📚' },
            { id: 'news' as AdminPage, label: '📰 الأخبار', icon: '📰' },
            { id: 'settings' as AdminPage, label: '⚙️ الإعدادات', icon: '⚙️' },
        ],
        fr: [
            { id: 'dashboard' as AdminPage, label: '📊 Tableau de bord', icon: '📊' },
            { id: 'users' as AdminPage, label: '👥 Utilisateurs', icon: '👥' },
            { id: 'lessons' as AdminPage, label: '📚 Cours', icon: '📚' },
            { id: 'news' as AdminPage, label: '📰 Actualités', icon: '📰' },
            { id: 'settings' as AdminPage, label: '⚙️ Paramètres', icon: '⚙️' },
        ],
    };

    const menu = menuItems[language];

    const renderContent = () => {
        switch (currentPage) {
            case 'dashboard':
                return <DashboardHome user={user} language={language} />;
            case 'users':
                return <div className="p-8 text-center text-gray-500">قريباً: إدارة المستخدمين</div>;
            case 'lessons':
                return <div className="p-8 text-center text-gray-500">قريباً: إدارة الدروس</div>;
            case 'news':
                return <div className="p-8 text-center text-gray-500">قريباً: إدارة الأخبار</div>;
            case 'settings':
                return <div className="p-8 text-center text-gray-500">قريباً: الإعدادات</div>;
            default:
                return <DashboardHome user={user} language={language} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <img src="/images/logo.jpg" alt="Logo" className="w-12 h-12 rounded-full" />
                        <div>
                            <h1 className="font-bold text-lg">LYCÉE ELFARAH</h1>
                            <p className="text-xs text-gray-400">لوحة الإدارة</p>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user.full_name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{user.full_name}</p>
                            <p className="text-xs text-gray-400 truncate">{user.role}</p>
                        </div>
                    </div>
                </div>

                {/* Menu */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {menu.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => setCurrentPage(item.id)}
                                    className={`w-full text-right px-4 py-3 rounded-lg transition-all ${currentPage === item.id
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-gray-300 hover:bg-gray-700'
                                        }`}
                                >
                                    <span className="text-lg mr-2">{item.icon}</span>
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={onLogout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition flex items-center justify-center gap-2"
                    >
                        <span>🚪</span>
                        <span>{language === 'ar' ? 'تسجيل الخروج' : 'Déconnexion'}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 p-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {menu.find((m) => m.id === currentPage)?.label || 'لوحة التحكم'}
                    </h2>
                </header>

                {/* Content */}
                <div className="p-6">{renderContent()}</div>
            </main>
        </div>
    );
};

// Dashboard Home Component
const DashboardHome: React.FC<{ user: AuthUser; language: Language }> = ({ user, language }) => {
    const stats = [
        { label: language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users', value: '0', icon: '👥', color: 'blue' },
        { label: language === 'ar' ? 'الدروس' : 'Lessons', value: '0', icon: '📚', color: 'green' },
        { label: language === 'ar' ? 'الأخبار' : 'News', value: '0', icon: '📰', color: 'purple' },
        { label: language === 'ar' ? 'الإعلانات' : 'Announcements', value: '0', icon: '📢', color: 'orange' },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-3xl font-bold mb-2">
                    {language === 'ar' ? `مرحباً، ${user.full_name}!` : `Bienvenue, ${user.full_name}!`}
                </h3>
                <p className="text-blue-100">
                    {language === 'ar' ? 'لوحة التحكم الرئيسية' : 'Tableau de bord principal'}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    // Define colors statically for Tailwind
                    const bgColors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-orange-100'];
                    const textColors = ['text-blue-600', 'text-green-600', 'text-purple-600', 'text-orange-600'];

                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-4xl">{stat.icon}</span>
                                <div className={`w-12 h-12 rounded-full ${bgColors[index]} flex items-center justify-center`}>
                                    <span className={`text-2xl font-bold ${textColors[index]}`}>{stat.value}</span>
                                </div>
                            </div>
                            <h4 className="text-gray-600 font-medium">{stat.label}</h4>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                    {language === 'ar' ? 'إجراءات سريعة' : 'Actions rapides'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-6 py-4 rounded-lg transition font-semibold">
                        ➕ {language === 'ar' ? 'إضافة مستخدم' : 'Ajouter utilisateur'}
                    </button>
                    <button className="bg-green-50 hover:bg-green-100 text-green-700 px-6 py-4 rounded-lg transition font-semibold">
                        📚 {language === 'ar' ? 'إضافة درس' : 'Ajouter cours'}
                    </button>
                    <button className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-6 py-4 rounded-lg transition font-semibold">
                        📰 {language === 'ar' ? 'إضافة خبر' : 'Ajouter actualité'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
