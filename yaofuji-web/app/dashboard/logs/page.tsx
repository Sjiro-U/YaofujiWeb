'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import {
    FarmData,
    ActivityLog,
    LOG_TYPE_LABELS,
    loadFarmData,
    saveFarmData,
    daysSince,
} from '@/lib/farmData';
import { ArrowLeft, Plus, X, Check, Droplets, Scissors, Leaf, Bug, FileText } from 'lucide-react';
import styles from './page.module.css';

const LOG_TYPE_ICONS: Record<ActivityLog['type'], React.ElementType> = {
    watering: Droplets,
    thinning: Scissors,
    fertilizing: Leaf,
    pesticide: Bug,
    other: FileText,
};

export default function LogsPage() {
    const { isLoggedIn } = useAuth();
    const router = useRouter();
    const [farmData, setFarmData] = useState<FarmData | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newLog, setNewLog] = useState({
        plotId: '',
        type: 'watering' as ActivityLog['type'],
        notes: '',
        date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        setFarmData(loadFarmData());
    }, [isLoggedIn, router]);

    if (!isLoggedIn || !farmData) {
        return null;
    }

    const handleAddLog = () => {
        if (!newLog.plotId || !newLog.notes) return;

        const log: ActivityLog = {
            id: Date.now().toString(),
            ...newLog,
        };

        const updatedData = {
            ...farmData,
            logs: [log, ...farmData.logs],
        };

        setFarmData(updatedData);
        saveFarmData(updatedData);
        setIsAdding(false);
        setNewLog({
            plotId: '',
            type: 'watering',
            notes: '',
            date: new Date().toISOString().split('T')[0],
        });
    };

    const getPlotLabel = (plotId: string) => {
        const plot = farmData.plots.find((p) => p.id === plotId);
        if (!plot) return plotId;
        const cropName = plot.crop?.name || '空き';
        return `${plot.row + 1}-${plot.col + 1} (${cropName})`;
    };

    const sortedLogs = [...farmData.logs].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* ヘッダー */}
                <div className={styles.header}>
                    <Link href="/dashboard" className={styles.backLink}>
                        <ArrowLeft size={18} />
                        ダッシュボードへ
                    </Link>
                    <div className={styles.headerRow}>
                        <h1>作業ログ</h1>
                        <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
                            <Plus size={18} />
                            新規記録
                        </button>
                    </div>
                </div>

                {/* 新規追加フォーム */}
                {isAdding && (
                    <div className={styles.addForm}>
                        <div className={styles.formHeader}>
                            <h2>作業を記録</h2>
                            <button onClick={() => setIsAdding(false)} className={styles.closeBtn}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className={styles.formGrid}>
                            <div className="form-group">
                                <label className="form-label">日付</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={newLog.date}
                                    onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">区画</label>
                                <select
                                    className="form-input"
                                    value={newLog.plotId}
                                    onChange={(e) => setNewLog({ ...newLog, plotId: e.target.value })}
                                >
                                    <option value="">選択してください</option>
                                    {farmData.plots.map((plot) => (
                                        <option key={plot.id} value={plot.id}>
                                            {getPlotLabel(plot.id)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">作業種類</label>
                                <select
                                    className="form-input"
                                    value={newLog.type}
                                    onChange={(e) => setNewLog({ ...newLog, type: e.target.value as ActivityLog['type'] })}
                                >
                                    {Object.entries(LOG_TYPE_LABELS).map(([key, label]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">メモ・備考</label>
                            <textarea
                                className="form-input"
                                rows={3}
                                placeholder="作業内容や気づいた点を記録..."
                                value={newLog.notes}
                                onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                            />
                        </div>
                        <div className={styles.formActions}>
                            <button className="btn btn-primary" onClick={handleAddLog}>
                                <Check size={16} />
                                保存する
                            </button>
                            <button className="btn btn-secondary" onClick={() => setIsAdding(false)}>
                                キャンセル
                            </button>
                        </div>
                    </div>
                )}

                {/* ログ一覧 */}
                <div className={styles.logList}>
                    {sortedLogs.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>まだ作業ログがありません</p>
                            <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
                                <Plus size={18} />
                                最初の記録を追加
                            </button>
                        </div>
                    ) : (
                        sortedLogs.map((log) => {
                            const Icon = LOG_TYPE_ICONS[log.type];
                            return (
                                <div key={log.id} className={styles.logItem}>
                                    <div className={styles.logIcon}>
                                        <Icon size={20} />
                                    </div>
                                    <div className={styles.logContent}>
                                        <div className={styles.logHeader}>
                                            <span className={styles.logType}>{LOG_TYPE_LABELS[log.type]}</span>
                                            <span className={styles.logPlot}>{getPlotLabel(log.plotId)}</span>
                                        </div>
                                        <p className={styles.logNotes}>{log.notes}</p>
                                        <span className={styles.logDate}>
                                            {log.date} ({daysSince(log.date) === 0 ? '今日' : `${daysSince(log.date)}日前`})
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
