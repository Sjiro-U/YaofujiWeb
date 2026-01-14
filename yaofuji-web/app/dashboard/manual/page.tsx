'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { ArrowLeft, BookOpen, Wrench, Sprout } from 'lucide-react';
import styles from './page.module.css';

const manualItems = [
    {
        href: '/dashboard/manual/ridge',
        icon: BookOpen,
        title: '畝の作り方',
        description: '畝立ての手順、サイズ、必要な道具を解説します。',
    },
    {
        href: '/dashboard/manual/tools',
        icon: Wrench,
        title: '農具・肥料紹介',
        description: '使用している農具と肥料の種類・使い方を紹介します。',
    },
    {
        href: '/dashboard/manual/crops',
        icon: Sprout,
        title: '農作物の育て方',
        description: '各作物の栽培方法とサカタのタネの詳細ページへのリンク。',
    },
];

export default function ManualPage() {
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, router]);

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* ヘッダー */}
                <div className={styles.header}>
                    <Link href="/dashboard" className={styles.backLink}>
                        <ArrowLeft size={18} />
                        ダッシュボードへ
                    </Link>
                    <h1>作業マニュアル</h1>
                    <p className={styles.subtitle}>農作業の基本を学ぼう</p>
                </div>

                {/* マニュアル一覧 */}
                <div className={styles.manualGrid}>
                    {manualItems.map((item) => (
                        <Link key={item.href} href={item.href} className={styles.manualCard}>
                            <div className={styles.cardIcon}>
                                <item.icon size={32} />
                            </div>
                            <h2>{item.title}</h2>
                            <p>{item.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
