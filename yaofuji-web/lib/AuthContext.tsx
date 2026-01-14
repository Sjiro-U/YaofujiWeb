'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isLoggedIn: boolean;
    userName: string | null;
    login: (password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// 簡易認証用のパスワード（デモ用）
const DEMO_PASSWORD = 'yaofuji123';
const DEMO_USER = '部員';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        // ローカルストレージから認証状態を復元
        const stored = localStorage.getItem('yaofuji_auth');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                setIsLoggedIn(data.isLoggedIn);
                setUserName(data.userName);
            } catch {
                localStorage.removeItem('yaofuji_auth');
            }
        }
    }, []);

    const login = (password: string): boolean => {
        if (password === DEMO_PASSWORD) {
            setIsLoggedIn(true);
            setUserName(DEMO_USER);
            localStorage.setItem('yaofuji_auth', JSON.stringify({
                isLoggedIn: true,
                userName: DEMO_USER,
            }));
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUserName(null);
        localStorage.removeItem('yaofuji_auth');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userName, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
