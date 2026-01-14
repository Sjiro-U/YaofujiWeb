'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { AVAILABLE_CROPS, SAKATA_LINKS, loadCustomCrops, Crop } from '@/lib/farmData';
import styles from '../page.module.css';

// 作物の追加情報
const cropDetails: Record<string, { season: string; duration: string }> = {
    tomato: { season: '4〜5月定植', duration: '収穫まで約60日' },
    eggplant: { season: '5〜6月定植', duration: '収穫まで約60日' },
    cucumber: { season: '4〜5月定植', duration: '収穫まで約40日' },
    carrot: { season: '3〜4月・7〜8月播種', duration: '収穫まで約100日' },
    daikon: { season: '8〜9月播種', duration: '収穫まで約60日' },
    spinach: { season: '9〜10月・3〜4月播種', duration: '収穫まで約40日' },
    cabbage: { season: '3〜4月・8〜9月定植', duration: '収穫まで約90日' },
    potato: { season: '2〜3月植え付け', duration: '収穫まで約100日' },
    onion: { season: '11月定植', duration: '収穫まで約180日' },
    pepper: { season: '5〜6月定植', duration: '収穫まで約60日' },
};

export default function CropsManualPage() {
    const { isLoggedIn } = useAuth();
    const router = useRouter();
    const [allCrops, setAllCrops] = useState<Crop[]>([]);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        // デフォルト作物 + カスタム作物を取得
        setAllCrops([...AVAILABLE_CROPS, ...loadCustomCrops()]);
    }, [isLoggedIn, router]);

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* ヘッダー */}
                <div className={styles.header}>
                    <Link href="/dashboard/manual" className={styles.backLink}>
                        <ArrowLeft size={18} />
                        マニュアル一覧へ
                    </Link>
                    <h1>農作物の育て方</h1>
                    <p className={styles.subtitle}>各作物の栽培方法を確認しよう</p>
                </div>

                {/* コンテンツ */}
                <div className={styles.content}>
                    <h2>作物一覧</h2>
                    <p>
                        八百藤で栽培している作物の一覧です。
                        詳しい育て方はサカタのタネの公式ページで確認できます。
                    </p>

                    <div className={styles.cropList}>
                        {allCrops.map((crop) => {
                            const details = cropDetails[crop.id];
                            const sakataLink = SAKATA_LINKS[crop.id];

                            return (
                                <div key={crop.id} className={styles.cropItem}>
                                    <div
                                        className={styles.cropColor}
                                        style={{ background: crop.color }}
                                    />
                                    <div className={styles.cropInfo}>
                                        <h4>
                                            {crop.name}
                                            {crop.variety && ` (${crop.variety})`}
                                            {crop.isCustom && <span style={{ color: 'var(--color-accent)', marginLeft: '8px' }}>カスタム</span>}
                                        </h4>
                                        {details ? (
                                            <p>{details.season} ・ {details.duration}</p>
                                        ) : (
                                            <p>栽培情報は準備中です</p>
                                        )}
                                    </div>
                                    {sakataLink ? (
                                        <a
                                            href={sakataLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.cropLink}
                                        >
                                            育て方を見る
                                            <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                                        </a>
                                    ) : (
                                        <span style={{ color: 'var(--color-text-light)', fontSize: 'var(--font-size-sm)' }}>
                                            リンク準備中
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className={styles.tip}>
                        <strong>💡 栽培のコツ</strong>
                        <p>
                            同じ場所で同じ科の野菜を連続して育てると「連作障害」が起きやすくなります。
                            計画的に作付けをローテーションしましょう。
                        </p>
                    </div>

                    <h2>科ごとの分類</h2>
                    <p>連作障害を防ぐために、同じ科の野菜を把握しておきましょう。</p>
                    <ul>
                        <li><strong>ナス科</strong>：トマト、ナス、ピーマン、じゃがいも</li>
                        <li><strong>ウリ科</strong>：きゅうり、カボチャ、スイカ</li>
                        <li><strong>アブラナ科</strong>：キャベツ、大根、ブロッコリー</li>
                        <li><strong>セリ科</strong>：にんじん、セロリ、パセリ</li>
                        <li><strong>ヒガンバナ科</strong>：たまねぎ、ニンニク、ネギ</li>
                        <li><strong>ヒユ科</strong>：ほうれん草</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
