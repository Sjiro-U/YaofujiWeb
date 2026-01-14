'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { ArrowLeft, User, Mail, Calendar, Leaf } from 'lucide-react';
import styles from './page.module.css';

// 部員データ（モック）
const members = [
    {
        id: 1,
        name: '田中 太郎',
        grade: '4年生',
        department: '環境情報学部',
        role: '部長',
        joinedYear: 2023,
        bio: '農業サークルを通じて、食の大切さを学んでいます。休日は畑で野菜の成長を見守るのが楽しみです。',
        favoriteVegetable: 'トマト',
    },
    {
        id: 2,
        name: '鈴木 花子',
        grade: '3年生',
        department: '総合政策学部',
        role: '副部長',
        joinedYear: 2024,
        bio: '土いじりが好きで入部しました。みんなで協力して育てた野菜を食べる瞬間が最高です！',
        favoriteVegetable: 'きゅうり',
    },
    {
        id: 3,
        name: '山田 健一',
        grade: '2年生',
        department: '環境情報学部',
        role: '会計',
        joinedYear: 2025,
        bio: '農業未経験でしたが、先輩たちに教えてもらいながら少しずつ覚えています。',
        favoriteVegetable: 'なす',
    },
    {
        id: 4,
        name: '佐藤 美咲',
        grade: '2年生',
        department: '総合政策学部',
        role: '広報',
        joinedYear: 2025,
        bio: 'SNSで八百藤の活動を発信しています。写真を撮るのが好き！',
        favoriteVegetable: 'ほうれん草',
    },
    {
        id: 5,
        name: '高橋 翔太',
        grade: '1年生',
        department: '環境情報学部',
        role: '',
        joinedYear: 2026,
        bio: '今年入部したばかりの新人です。早く野菜を育てられるようになりたい！',
        favoriteVegetable: 'じゃがいも',
    },
];

export default function MembersPage() {
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
                    <h1>部員名簿・自己紹介</h1>
                    <p className={styles.subtitle}>現在 {members.length} 名の部員が活動中</p>
                </div>

                {/* 部員一覧 */}
                <div className={styles.memberGrid}>
                    {members.map((member) => (
                        <div key={member.id} className={styles.memberCard}>
                            <div className={styles.memberHeader}>
                                <div className={styles.avatar}>
                                    <User size={32} />
                                </div>
                                <div className={styles.memberInfo}>
                                    <h3>{member.name}</h3>
                                    <span className={styles.grade}>{member.grade}</span>
                                    {member.role && <span className={styles.role}>{member.role}</span>}
                                </div>
                            </div>

                            <div className={styles.memberDetails}>
                                <div className={styles.detailRow}>
                                    <span className={styles.icon}><Mail size={14} /></span>
                                    <span>{member.department}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.icon}><Calendar size={14} /></span>
                                    <span>{member.joinedYear}年入部</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.icon}><Leaf size={14} /></span>
                                    <span>好きな野菜: {member.favoriteVegetable}</span>
                                </div>
                            </div>

                            <p className={styles.bio}>{member.bio}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
