'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Sun, Cloud, CloudRain } from 'lucide-react';
import styles from './page.module.css';

interface ScheduleEvent {
    id: string;
    date: string;
    time: string;
    title: string;
    location: 'sfc' | 'fieldYu';
    description?: string;
    participants?: number;
    weather?: 'sunny' | 'cloudy' | 'rainy';
    isCancelled?: boolean;
}

// モックデータ（将来的にはAPIやLocalStorageから取得）
const mockEvents: ScheduleEvent[] = [
    {
        id: '1',
        date: '2026-01-18',
        time: '10:00〜12:00',
        title: '通常活動日',
        location: 'sfc',
        description: '冬野菜の手入れと追肥作業',
        participants: 8,
        weather: 'sunny',
    },
    {
        id: '2',
        date: '2026-01-25',
        time: '10:00〜12:00',
        title: '通常活動日',
        location: 'fieldYu',
        description: '畝の準備と春野菜の計画',
        participants: 6,
        weather: 'cloudy',
    },
    {
        id: '3',
        date: '2026-02-01',
        time: '10:00〜12:00',
        title: '通常活動日',
        location: 'sfc',
        description: '収穫作業',
        weather: 'sunny',
    },
    {
        id: '4',
        date: '2026-02-08',
        time: '10:00〜12:00',
        title: '通常活動日',
        location: 'fieldYu',
        description: 'ジャガイモ植え付け準備',
        weather: 'sunny',
    },
    {
        id: '5',
        date: '2026-02-15',
        time: '13:00〜17:00',
        title: '新歓イベント',
        location: 'sfc',
        description: '新入部員向けの農業体験会',
        participants: 15,
        weather: 'sunny',
    },
];

const LOCATION_LABELS = {
    sfc: 'SFC近隣農地',
    fieldYu: 'フィールドゆう',
};

const WEATHER_ICONS = {
    sunny: Sun,
    cloudy: Cloud,
    rainy: CloudRain,
};

export default function SchedulePage() {
    const { isLoggedIn } = useAuth();
    const router = useRouter();
    const [events, setEvents] = useState<ScheduleEvent[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        // モックデータをロード
        setEvents(mockEvents);
    }, [isLoggedIn, router]);

    if (!isLoggedIn) {
        return null;
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const days = ['日', '月', '火', '水', '木', '金', '土'];
        return `${date.getMonth() + 1}/${date.getDate()}（${days[date.getDay()]}）`;
    };

    const isToday = (dateStr: string) => {
        const today = new Date().toISOString().split('T')[0];
        return dateStr === today;
    };

    const isPast = (dateStr: string) => {
        const today = new Date().toISOString().split('T')[0];
        return dateStr < today;
    };

    const upcomingEvents = events
        .filter(e => !isPast(e.date))
        .sort((a, b) => a.date.localeCompare(b.date));

    const pastEvents = events
        .filter(e => isPast(e.date))
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 3);

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* ヘッダー */}
                <div className={styles.header}>
                    <Link href="/dashboard" className={styles.backLink}>
                        <ArrowLeft size={18} />
                        ダッシュボードへ
                    </Link>
                    <h1>活動予定</h1>
                    <p className={styles.subtitle}>今月のスケジュールと活動場所</p>
                </div>

                {/* 今後の予定 */}
                <section className={styles.section}>
                    <h2>
                        <Calendar size={20} />
                        今後の予定
                    </h2>
                    {upcomingEvents.length > 0 ? (
                        <div className={styles.eventList}>
                            {upcomingEvents.map(event => {
                                const WeatherIcon = event.weather ? WEATHER_ICONS[event.weather] : null;
                                return (
                                    <div
                                        key={event.id}
                                        className={`${styles.eventCard} ${isToday(event.date) ? styles.today : ''} ${event.isCancelled ? styles.cancelled : ''}`}
                                    >
                                        <div className={styles.eventDate}>
                                            <span className={styles.dateText}>{formatDate(event.date)}</span>
                                            {isToday(event.date) && <span className={styles.todayBadge}>今日</span>}
                                        </div>
                                        <div className={styles.eventContent}>
                                            <h3>{event.title}</h3>
                                            <div className={styles.eventMeta}>
                                                <span>
                                                    <Clock size={14} />
                                                    {event.time}
                                                </span>
                                                <span>
                                                    <MapPin size={14} />
                                                    {LOCATION_LABELS[event.location]}
                                                </span>
                                                {event.participants && (
                                                    <span>
                                                        <Users size={14} />
                                                        {event.participants}名参加予定
                                                    </span>
                                                )}
                                                {WeatherIcon && (
                                                    <span className={styles.weather}>
                                                        <WeatherIcon size={14} />
                                                    </span>
                                                )}
                                            </div>
                                            {event.description && (
                                                <p className={styles.eventDescription}>{event.description}</p>
                                            )}
                                            {event.isCancelled && (
                                                <span className={styles.cancelledBadge}>中止</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className={styles.noEvents}>予定されている活動はありません</p>
                    )}
                </section>

                {/* 活動場所 */}
                <section className={styles.section}>
                    <h2>
                        <MapPin size={20} />
                        活動場所
                    </h2>
                    <div className={styles.locationGrid}>
                        <div className={styles.locationCard}>
                            <h3>SFC近隣農地</h3>
                            <p>慶應義塾大学湘南藤沢キャンパス近くの農地</p>
                            <a
                                href="https://maps.app.goo.gl/xxxxxx"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.mapLink}
                            >
                                Google Mapで開く
                            </a>
                        </div>
                        <div className={styles.locationCard}>
                            <h3>フィールドゆう</h3>
                            <p>広々とした農地で本格的な野菜栽培が可能</p>
                            <a
                                href="https://maps.google.com/?q=35.3544,139.4906"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.mapLink}
                            >
                                Google Mapで開く
                            </a>
                        </div>
                    </div>
                </section>

                {/* 過去の活動 */}
                {pastEvents.length > 0 && (
                    <section className={styles.section}>
                        <h2>過去の活動</h2>
                        <div className={styles.pastEventList}>
                            {pastEvents.map(event => (
                                <div key={event.id} className={styles.pastEvent}>
                                    <span className={styles.pastDate}>{formatDate(event.date)}</span>
                                    <span className={styles.pastTitle}>{event.title}</span>
                                    <span className={styles.pastLocation}>{LOCATION_LABELS[event.location]}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 注意事項 */}
                <div className={styles.notice}>
                    <strong>📢 お知らせ</strong>
                    <p>
                        活動予定は天候により変更・中止になる場合があります。
                        最新情報はLINEグループでご確認ください。
                    </p>
                </div>
            </div>
        </div>
    );
}
