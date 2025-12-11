import React from 'react';
import AuthWrapper from './AuthWrapper';
import AdminDashboard from './components/admin/AdminDashboard';

function TestAuthApp() {
    return (
        <AuthWrapper language="ar">
            {(user, logout) => {
                if (!user) {
                    return (
                        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                            <div className="text-center">
                                <div className="mb-4">
                                    <img src="/images/logo.jpg" alt="Logo" className="w-24 h-24 object-cover rounded-full mx-auto mb-4" />
                                </div>
                                <p className="text-2xl text-gray-700 font-semibold">
                                    يرجى تسجيل الدخول للمتابعة
                                </p>
                                <p className="text-gray-500 mt-2">
                                    اضغط على زر تسجيل الدخول في الأعلى
                                </p>
                            </div>
                        </div>
                    );
                }

                // If user is admin, show Admin Dashboard
                if (user.role === 'admin') {
                    return <AdminDashboard user={user} language="ar" onLogout={logout} />;
                }

                // For other roles, show simple success page
                return (
                    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
                        <div className="max-w-3xl mx-auto">
                            {/* Success Card */}
                            <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
                                <div className="text-center mb-8">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-4xl">✅</span>
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        تم تسجيل الدخول بنجاح!
                                    </h1>
                                    <p className="text-gray-600">مرحباً بك في نظام ثانوية الفرح</p>
                                </div>

                                {/* User Info */}
                                <div className="space-y-4 mb-8">
                                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                                        <p className="text-sm text-gray-600 mb-1">الاسم الكامل</p>
                                        <p className="text-xl font-bold text-gray-900">{user.full_name}</p>
                                    </div>

                                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                        <p className="text-sm text-gray-600 mb-1">البريد الإلكتروني</p>
                                        <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                                    </div>

                                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                                        <p className="text-sm text-gray-600 mb-1">الدور</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {user.role === 'teacher' && '👨‍🏫 أستاذ'}
                                            {user.role === 'student' && '👨‍🎓 طالب'}
                                            {user.role === 'parent' && '👨‍👩‍👧 ولي أمر'}
                                        </p>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-600 mb-1">معرف المستخدم (User ID)</p>
                                        <p className="text-xs font-mono text-gray-700 break-all">{user.id}</p>
                                    </div>
                                </div>

                                {/* Logout Button */}
                                <button
                                    onClick={logout}
                                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                                >
                                    🚪 تسجيل الخروج
                                </button>
                            </div>

                            {/* Info Card */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                <h3 className="font-bold text-blue-900 mb-2">✨ الاختبار ناجح!</h3>
                                <p className="text-blue-800 text-sm">
                                    نظام المصادقة يعمل بشكل صحيح. يمكنك الآن دمجه في التطبيق الرئيسي.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            }}
        </AuthWrapper>
    );
}

export default TestAuthApp;
