import React, { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage';
import { getCurrentUser, signOut } from './services/authService';
import type { AuthUser } from './services/authService';

const TestAuth: React.FC = () => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    };

    const handleSignOut = async () => {
        await signOut();
        setUser(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">جاري التحميل...</div>
            </div>
        );
    }

    if (!user) {
        return <AuthPage onSuccess={checkUser} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold mb-6 text-center">
                        ✅ تم تسجيل الدخول بنجاح!
                    </h1>

                    <div className="space-y-4 mb-8">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-600">الاسم:</p>
                            <p className="text-lg font-bold">{user.full_name}</p>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-gray-600">البريد الإلكتروني:</p>
                            <p className="text-lg font-bold">{user.email}</p>
                        </div>

                        <div className="p-4 bg-purple-50 rounded-lg">
                            <p className="text-sm text-gray-600">الدور:</p>
                            <p className="text-lg font-bold">
                                {user.role === 'admin' && 'مدير'}
                                {user.role === 'teacher' && 'أستاذ'}
                                {user.role === 'student' && 'طالب'}
                                {user.role === 'parent' && 'ولي أمر'}
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">User ID:</p>
                            <p className="text-xs font-mono">{user.id}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition"
                    >
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestAuth;
