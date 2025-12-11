import React, { useState, useEffect } from 'react';
import LoginModal from './components/LoginModal';
import LoginForm from './components/LoginForm';
import { getCurrentUser, signOut, onAuthStateChange } from './services/authService';
import type { AuthUser } from './services/authService';
import { Language, UserRole } from './types';

interface AuthWrapperProps {
    language: Language;
    children: (user: AuthUser | null, logout: () => void) => React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ language, children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState<UserRole>(null);

    useEffect(() => {
        // Check for existing session
        checkUser();

        // Listen to auth changes
        const subscription = onAuthStateChange((authUser) => {
            setUser(authUser);
            setLoading(false);
        });

        return () => {
            subscription?.data?.subscription?.unsubscribe();
        };
    }, []);

    const checkUser = async () => {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    };

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
        setShowRoleModal(false);
    };

    const handleLoginSuccess = () => {
        checkUser();
        setSelectedRole(null);
    };

    const handleLogout = async () => {
        await signOut();
        setUser(null);
        setSelectedRole(null);
    };

    const handleBackToRoleSelection = () => {
        setSelectedRole(null);
        setShowRoleModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-gray-600">
                    {language === 'ar' ? 'جاري التحميل...' : 'Chargement...'}
                </div>
            </div>
        );
    }

    // If not logged in and no role selected, show role selection modal
    if (!user && !selectedRole) {
        return (
            <>
                {children(null, handleLogout)}
                <LoginModal
                    isOpen={true}  // ← دائماً مفتوح إذا لم يكن المستخدم مسجل
                    onClose={() => { }} // ← لا يمكن إغلاقه
                    language={language}
                    onLogin={handleRoleSelect}
                />
            </>
        );
    }

    // If role selected but not logged in, show login form
    if (!user && selectedRole) {
        return (
            <LoginForm
                role={selectedRole}
                language={language}
                onSuccess={handleLoginSuccess}
                onBack={handleBackToRoleSelection}
            />
        );
    }

    // User is logged in
    return <>{children(user, handleLogout)}</>;
};

export default AuthWrapper;
