'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, AlertCircle, Leaf } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import styles from './page.module.css';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, isLoggedIn } = useAuth();
    const router = useRouter();

    // 既にログイン済みならダッシュボードへ
    if (isLoggedIn) {
        router.push('/dashboard');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // 少し遅延を入れてUX向上
        await new Promise(resolve => setTimeout(resolve, 500));

        const success = login(password);
        setIsLoading(false);

        if (success) {
            router.push('/dashboard');
        } else {
            setError('パスワードが正しくありません');
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.loginBox}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <Leaf size={32} />
                    </div>
                    <h1 className={styles.title}>部員ログイン</h1>
                    <p className={styles.subtitle}>八百藤 部員専用ページへのアクセス</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>
                            <Lock size={16} />
                            パスワード
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                                placeholder="パスワードを入力"
                                required
                            />
                            <button
                                type="button"
                                className={styles.toggleBtn}
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className={styles.error}>
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={isLoading}
                    >
                        {isLoading ? 'ログイン中...' : 'ログイン'}
                    </button>
                </form>

                <div className={styles.hint}>
                    <p>※ デモ用パスワード: <code>yaofuji123</code></p>
                </div>
            </div>
        </div>
    );
}
