import React, { useState } from 'react';
import { IconX, IconBriefcase, IconBookOpen, IconGraduationCap } from './Icons';
import { Language, UserRole } from '../types';
import { signIn } from '../services/authService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLogin: (role: UserRole) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, language, onLogin }) => {
  const [step, setStep] = useState<'role' | 'credentials'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('credentials');
    setError('');

    // Auto-fill demo credentials based on role
    if (role === 'admin') {
      setEmail('admin@elfarah.ma');
      setPassword('admin123');
    } else if (role === 'teacher') {
      setEmail('teacher@elfarah.ma');
      setPassword('teacher123');
    } else if (role === 'student') {
      setEmail('student@elfarah.ma');
      setPassword('student123');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn(email, password);

      if (result.success && result.profile) {
        // Verify the role matches
        if (result.profile.role === selectedRole) {
          onLogin(result.profile.role as UserRole);
          onClose();
          resetForm();
        } else {
          setError(language === 'ar'
            ? `هذا الحساب ليس حساب ${getRoleLabel(selectedRole)}`
            : `Ce compte n'est pas un compte ${getRoleLabel(selectedRole)}`
          );
        }
      } else {
        setError(result.error || (language === 'ar'
          ? 'خطأ في البريد الإلكتروني أو كلمة المرور'
          : 'Email ou mot de passe incorrect'
        ));
      }
    } catch (err: any) {
      setError(err.message || (language === 'ar'
        ? 'حدث خطأ أثناء تسجيل الدخول'
        : 'Une erreur est survenue'
      ));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('role');
    setSelectedRole(null);
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleBack = () => {
    setStep('role');
    setError('');
  };

  const getRoleLabel = (role: UserRole) => {
    if (role === 'admin') return language === 'ar' ? 'الإدارة' : 'Administration';
    if (role === 'teacher') return language === 'ar' ? 'الأساتذة' : 'Enseignants';
    if (role === 'student') return language === 'ar' ? 'التلاميذ' : 'Élèves';
    return '';
  };

  const content = {
    ar: {
      title: "تسجيل الدخول",
      subtitle: "يرجى اختيار الفضاء الخاص بكم",
      emailLabel: "البريد الإلكتروني",
      passwordLabel: "كلمة المرور",
      loginButton: "تسجيل الدخول",
      backButton: "رجوع",
      loginTo: "تسجيل الدخول إلى",
      demoNote: "ملاحظة: تم ملء البيانات التجريبية تلقائياً",
      cards: [
        { title: "الإدارة", role: 'admin' as UserRole, icon: IconBriefcase, color: "bg-blue-50 text-blue-600 hover:border-blue-500" },
        { title: "الأساتذة", role: 'teacher' as UserRole, icon: IconBookOpen, color: "bg-green-50 text-green-600 hover:border-green-500" },
        { title: "التلاميذ", role: 'student' as UserRole, icon: IconGraduationCap, color: "bg-yellow-50 text-yellow-600 hover:border-yellow-500" },
      ]
    },
    fr: {
      title: "Connexion",
      subtitle: "Veuillez choisir votre espace",
      emailLabel: "Email",
      passwordLabel: "Mot de passe",
      loginButton: "Se connecter",
      backButton: "Retour",
      loginTo: "Connexion à",
      demoNote: "Note: Les identifiants de démo sont pré-remplis",
      cards: [
        { title: "Administration", role: 'admin' as UserRole, icon: IconBriefcase, color: "bg-blue-50 text-blue-600 hover:border-blue-500" },
        { title: "Enseignants", role: 'teacher' as UserRole, icon: IconBookOpen, color: "bg-green-50 text-green-600 hover:border-green-500" },
        { title: "Élèves", role: 'student' as UserRole, icon: IconGraduationCap, color: "bg-yellow-50 text-yellow-600 hover:border-yellow-500" },
      ]
    }
  };

  const t = content[language];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => {
          onClose();
          resetForm();
        }}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 animate-fade-in-up">
        <button
          onClick={() => {
            onClose();
            resetForm();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <IconX className="w-6 h-6" />
        </button>

        {step === 'role' ? (
          <>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h2>
              <p className="text-gray-500">{t.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.cards.map((card, index) => (
                <button
                  key={index}
                  className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 border-transparent transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group ${card.color.split(' ')[0]}`}
                  onClick={() => handleRoleSelect(card.role)}
                >
                  <div className={`w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${card.color.split(' ')[1]}`}>
                    <card.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{card.title}</h3>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {t.loginTo} {getRoleLabel(selectedRole)}
              </h2>
              <p className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg inline-block mt-2">
                💡 {t.demoNote}
              </p>
            </div>

            <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  ⚠️ {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.passwordLabel}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition"
                  disabled={loading}
                >
                  ← {t.backButton}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? '...' : t.loginButton}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal;