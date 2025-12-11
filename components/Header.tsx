import React, { useState } from 'react';
import { NavItem, Language, UserRole } from '../types';
import { IconMenu, IconX, IconGlobe, IconBriefcase, IconUsers, IconGraduationCap } from './Icons';
import LoginModal from './LoginModal';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentUser: UserRole;
  onLogin: (role: UserRole) => void;
  onLogout: () => void;
  navItems: NavItem[];
  onUpdateNav: (id: number, newLabel: string) => void;
  activePage: string;
  setActivePage: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  currentUser,
  onLogin,
  onLogout,
  navItems,
  onUpdateNav,
  activePage,
  setActivePage
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEditingNav, setIsEditingNav] = useState(false); // New state for nav editing mode
  const isEditable = currentUser === 'admin';

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'fr' : 'ar');
  };

  const getUserLabel = () => {
    if (currentUser === 'admin') return language === 'ar' ? 'الإدارة' : 'Admin';
    if (currentUser === 'teacher') return language === 'ar' ? 'الأستاذ' : 'Prof';
    if (currentUser === 'student') return language === 'ar' ? 'التلميذ' : 'Élève';
    return '';
  };

  const getUserIcon = () => {
    if (currentUser === 'admin') return <IconBriefcase className="w-4 h-4" />;
    if (currentUser === 'teacher') return <IconUsers className="w-4 h-4" />;
    return <IconGraduationCap className="w-4 h-4" />;
  };

  const getDashboardLabel = () => {
    if (currentUser === 'teacher') return language === 'ar' ? 'فضاء الأستاذ' : 'Espace Prof';
    if (currentUser === 'student') return language === 'ar' ? 'فضاء التلميذ' : 'Espace Élève';
    return '';
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100 transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div
              className="flex-shrink-0 flex items-center gap-3 cursor-pointer group"
              onClick={() => setActivePage('home')}
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-yassamine-gold shadow-sm group-hover:shadow-md transition-all">
                <img
                  src="/images/logo.jpg"
                  alt="Lycée El Farah Logo"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-yassamine-blue leading-tight tracking-wide">
                  {language === 'ar' ? 'ثانوية الفرح الخصوصية' : 'LYCÉE EL FARAH'}
                </span>
                <span className="text-xs text-yassamine-gold font-medium tracking-wider">
                  {language === 'ar' ? 'التميز والإبداع' : 'Excellence & Innovation'}
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => (
                <div key={item.id} className="relative group">
                  {isEditable && isEditingNav ? (
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => onUpdateNav(item.id, e.target.value)}
                      className="w-28 bg-yellow-50 border-b-2 border-yellow-400 text-sm font-medium focus:outline-none focus:border-yellow-600 px-2 py-1 rounded"
                      placeholder={language === 'ar' ? 'اسم القسم' : 'Nom section'}
                    />
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setActivePage(item.href)}
                        className={`font-medium transition-colors text-sm relative whitespace-nowrap py-2 ${activePage === item.href ? 'text-yassamine-blue font-bold' : 'text-gray-600 hover:text-yassamine-blue'
                          }`}
                      >
                        {item.label}
                        <span className={`absolute bottom-0 left-0 h-0.5 bg-yassamine-blue rounded-full transition-all duration-300 ${activePage === item.href ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                      </button>
                      {isEditable && !isEditingNav && (
                        <span className="text-yellow-500 text-xs opacity-50">✏️</span>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Edit Nav Toggle Button (only for admin) */}
              {isEditable && (
                <button
                  onClick={() => setIsEditingNav(!isEditingNav)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isEditingNav
                      ? 'bg-yellow-500 text-white shadow-md'
                      : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                    }`}
                  title={language === 'ar' ? 'تعديل القائمة' : 'Modifier le menu'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {isEditingNav
                    ? (language === 'ar' ? 'حفظ' : 'Sauvegarder')
                    : (language === 'ar' ? 'تعديل القائمة' : 'Modifier menu')
                  }
                </button>
              )}

              {/* Dashboard Link for Admin, Teachers and Students */}
              {(currentUser === 'admin' || currentUser === 'teacher' || currentUser === 'student') && (
                <button
                  onClick={() => setActivePage('dashboard')}
                  className={`flex items-center gap-2 font-medium transition-all text-sm relative whitespace-nowrap py-2 px-3 rounded-lg ${activePage === 'dashboard'
                    ? 'bg-blue-50 text-yassamine-blue font-bold shadow-sm'
                    : 'text-gray-600 hover:text-yassamine-blue hover:bg-gray-50'
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  {currentUser === 'admin'
                    ? (language === 'ar' ? 'لوحة التحكم' : 'Dashboard')
                    : getDashboardLabel()
                  }
                </button>
              )}
            </nav>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-gray-600 hover:text-yassamine-blue transition-colors px-3 py-1.5 rounded-full border border-gray-200 hover:border-yassamine-blue hover:shadow-sm"
              >
                <IconGlobe className="w-4 h-4" />
                <span className="text-sm font-semibold">{language === 'ar' ? 'Français' : 'العربية'}</span>
              </button>

              {currentUser ? (
                <div className="flex items-center gap-3 animate-fade-in">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-sm ${currentUser === 'admin' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-yassamine-blue border border-blue-100'
                    }`}>
                    {getUserIcon()}
                    <span>{getUserLabel()}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="text-gray-500 hover:text-red-500 text-sm font-medium underline decoration-red-200 hover:decoration-red-500 transition-all"
                  >
                    {language === 'ar' ? 'خروج' : 'Déconnexion'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-yassamine-blue hover:bg-blue-800 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm whitespace-nowrap active:scale-95"
                >
                  {language === 'ar' ? 'تسجيل الدخول' : 'Connexion'}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-3">
              <button onClick={toggleLanguage} className="text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
                <span className="font-bold text-xs">{language === 'ar' ? 'FR' : 'ع'}</span>
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-yassamine-blue transition p-2 hover:bg-gray-100 rounded-full"
              >
                {isMenuOpen ? <IconX className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl animate-slide-up">
            <div className="px-4 py-6 space-y-3">
              {navItems.map((item) => (
                <div key={item.id}>
                  {isEditable ? (
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => onUpdateNav(item.id, e.target.value)}
                      className="block w-full px-4 py-3 text-gray-700 border-b border-dashed border-yellow-400 bg-gray-50 rounded-lg"
                    />
                  ) : (
                    <button
                      onClick={() => {
                        setActivePage(item.href);
                        setIsMenuOpen(false);
                      }}
                      className={`block w-full text-right px-4 py-3 rounded-lg font-bold transition-all ${activePage === item.href
                        ? 'bg-blue-50 text-yassamine-blue shadow-sm translate-x-1'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-yassamine-blue'
                        }`}
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}

              {(currentUser === 'admin' || currentUser === 'teacher' || currentUser === 'student') && (
                <button
                  onClick={() => {
                    setActivePage('dashboard');
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-right px-4 py-3 rounded-lg font-bold transition-all ${activePage === 'dashboard'
                    ? 'bg-blue-50 text-yassamine-blue shadow-sm translate-x-1'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-yassamine-blue'
                    }`}
                >
                  {currentUser === 'admin'
                    ? (language === 'ar' ? 'لوحة التحكم' : 'Dashboard')
                    : getDashboardLabel()
                  }
                </button>
              )}

              <div className="pt-6 mt-4 border-t border-gray-100">
                {currentUser ? (
                  <button
                    onClick={() => { onLogout(); setIsMenuOpen(false); }}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3.5 rounded-xl font-bold shadow-sm border border-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <IconBriefcase className="w-4 h-4" />
                    {language === 'ar' ? 'تسجيل الخروج' : 'Déconnexion'}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsLoginModalOpen(true);
                    }}
                    className="w-full bg-yassamine-blue hover:bg-blue-800 text-white px-4 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <IconUsers className="w-4 h-4" />
                    {language === 'ar' ? 'تسجيل الدخول' : 'Connexion'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        language={language}
        onLogin={onLogin}
      />
    </>
  );
};

export default Header;