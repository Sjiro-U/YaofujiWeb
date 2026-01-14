'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import {
    LayoutGrid,
    Map,
    ClipboardList,
    Users,
    LogOut,
    Leaf,
    Bell,
    Calendar,
    BookOpen
} from 'lucide-react';
import styles from './page.module.css';

// お知らせデータ（モック）
const notices = [
    { id: 1, date: '2026/01/08', content: '今週土曜は雨天のため、活動中止です。', type: 'alert' },
    { id: 2, date: '2026/01/05', content: '追肥作業の予定があります。詳細はLINEグループをご確認ください。', type: 'info' },
    { id: 3, date: '2025/12/28', content: '年末年始の活動スケジュールを更新しました。', type: 'info' },
];

// メニューアイテム
const menuItems = [
    {
        href: '/dashboard/farm',
        icon: Map,
        title: '農地管理',
        description: '区画の状態確認・更新'
    },
    {
        href: '/dashboard/logs',
        icon: ClipboardList,
        title: '作業ログ',
        description: '栽培記録の入力・確認'
    },
    {
        href: '/dashboard/members',
        icon: Users,
        title: '部員名簿',
        description: '連絡先・担当区画'
    },
    {
        href: '/dashboard/schedule',
        icon: Calendar,
        title: '活動予定',
        description: '今月のスケジュール'
    },
    {
        href: '/dashboard/manual',
        icon: BookOpen,
        title: '作業マニュアル',
        description: '畝の作り方・農具・育て方'
    },
];

export default function DashboardPage() {
    const { isLoggedIn, userName, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, router]);

    if (!isLoggedIn) {
        return null;
    }

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* ヘッダー部分 */}
                <div className={styles.header}>
                    <div className={styles.welcome}>
                        <Leaf className={styles.welcomeIcon} />
                        <div>
                            <h1>こんにちは、{userName}さん</h1>
                            <p>八百藤 部員専用ページへようこそ</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <LogOut size={18} />
                        ログアウト
                    </button>
                </div>

                {/* お知らせセクション */}
                <section className={styles.notices}>
                    <h2>
                        <Bell size={20} />
                        お知らせ
                    </h2>
                    <ul className={styles.noticeList}>
                        {notices.map((notice) => (
                            <li key={notice.id} className={styles.noticeItem} data-type={notice.type}>
                                <span className={styles.noticeDate}>{notice.date}</span>
                                <span className={styles.noticeContent}>{notice.content}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* メニューグリッド */}
                <section className={styles.menuSection}>
                    <h2>
                        <LayoutGrid size={20} />
                        メニュー
                    </h2>
                    <div className={styles.menuGrid}>
                        {menuItems.map((item) => (
                            <Link key={item.href} href={item.href} className={styles.menuCard}>
                                <div className={styles.menuIcon}>
                                    <item.icon size={28} />
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
