import React, { useState } from 'react';
import { signIn } from '../services/authService';
import { Language, UserRole } from '../types';

interface LoginFormProps {
    role: UserRole;
    language: Language;
    onSuccess: () => void;
    onBack: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ role, language, onSuccess, onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const content = {
        ar: {
            title: role === 'admin' ? 'تسجيل دخول الإدارة' : role === 'teacher' ? 'تسجيل دخول الأساتذة' : 'تسجيل دخول التلاميذ',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            login: 'تسجيل الدخول',
            back: 'رجوع',
            loading: 'جاري التحميل...',
        },
        fr: {
            title: role === 'admin' ? 'Connexion Administration' : role === 'teacher' ? 'Connexion Enseignants' : 'Connexion Élèves',
            email: 'Email',
            password: 'Mot de passe',
            login: 'Se connecter',
            back: 'Retour',
            loading: 'Chargement...',
        }
    };

    const t = content[language];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn(email, password);

            if (result.success && result.profile) {
                // Check if user role matches selected role
                if (result.profile.role !== role) {
                    setError(language === 'ar'
                        ? 'هذا الحساب غير مخصص لهذا الفضاء'
                        : 'Ce compte n\'est pas autorisé pour cet espace');
                    setLoading(false);
                    return;
                }

                onSuccess();
            } else {
                setError(result.error || (language === 'ar' ? 'خطأ في تسجيل الدخول' : 'Erreur de connexion'));
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <img src={`${import.meta.env.BASE_URL}images/logo.jpg`} alt="Logo" className="w-16 h-16 object-cover rounded-full" />
                        <h1 className="text-2xl font-bold text-gray-900">LYCÉE ELFARAH</h1>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-700">{t.title}</h2>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t.email}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t.password}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            required
                            minLength={6}
                        />
                    </div>


                    <div className="space-y-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-primary text-white font-bold py-4 rounded-lg hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                        >
                            {loading ? t.loading : t.login}
                        </button>

                        <button
                            type="button"
                            onClick={onBack}
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition"
                        >
                            {t.back}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
