'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { ArrowLeft } from 'lucide-react';
import styles from '../page.module.css';

const tools = [
    { name: 'クワ（鍬）', description: '土を掘り起こしたり、畝を作るのに使用', image: '/tool-kuwa.jpg' },
    { name: 'レーキ', description: '土をならしたり、雑草を取り除くのに使用', image: '/tool-rake.png' },
    { name: 'スコップ', description: '深く土を掘ったり、移動させるのに使用', image: '/tool-shovel.jpg' },
    { name: 'ジョウロ', description: '水やりに使用。ハス口付きが便利', image: '/tool-watering-can.png' },
    { name: 'まんのう（万能鍬）', description: '土を耕すのに使用する三又の鍬', image: '/tool-mannou.jpg' },
    { name: '木製定規', description: '畝のサイズや間隔を測定するのに使用', image: '/tool-ruler.png' },
    { name: '印棒（しるしぼう）', description: '1センチごとに針金で印をつけた自作の棒。種まきの間隔を測るのに使用', image: '/tool-shirushi.png' },
    { name: '平行器', description: '畝を作る際に並行を図るための道具。30cmの木の棒2本に紐をくくりつけて使用', image: '/tool-parallel.png' },
    { name: '塩ビパイプ', description: '畝の表面を平らにならすのに使用', image: '/tool-pvc.jpg' },
    { name: 'マルチ', description: '畝を覆うビニールシート。保温・防草効果あり', image: '/tool-mulch.jpg' },
    { name: '寒冷紗', description: '畝の上に取り付ける防虫ネット', image: '/tool-shade.jpg' },
    { name: 'パオパオ', description: '種を筋植えした時に保温のためにつける白い不織布', image: '/tool-paopao.jpg' },
    { name: 'マルチカッター', description: 'マルチを丸く切り抜く道具。苗の植え穴を開けるのに使用', image: '/tool-cutter.jpg' },
];

const fertilizers = [
    {
        name: '化成肥料',
        description: '窒素・リン酸・カリをバランスよく含む即効性肥料',
        usage: '追肥として使用。野菜の成長期に少量ずつ与える',
        image: '/fert-chemical.png',
    },
    {
        name: '苦土石灰（くどせっかい）',
        description: 'マグネシウムを含む石灰。土壌の酸性を中和する',
        usage: '植え付け2週間前に土に混ぜ込む。1㎡あたり100〜150g',
        image: '/fert-dolomite.png',
    },
    {
        name: '過リン酸石灰',
        description: 'リン酸を多く含む肥料。根の発育を促進する',
        usage: '元肥として土に混ぜ込む。1㎡あたり50〜100g',
        image: '/fert-superphosphate.png',
    },
    {
        name: '堆肥',
        description: '有機物を発酵させた土壌改良材。土をふかふかにする',
        usage: '植え付け前に土に混ぜ込む。1㎡あたり2〜3kg',
        image: '/fert-compost.png',
    },
];

export default function ToolsManualPage() {
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
                    <Link href="/dashboard/manual" className={styles.backLink}>
                        <ArrowLeft size={18} />
                        マニュアル一覧へ
                    </Link>
                    <h1>農具・肥料紹介</h1>
                    <p className={styles.subtitle}>使用している道具と肥料を知ろう</p>
                </div>

                {/* コンテンツ */}
                <div className={styles.content}>
                    <h2>農具一覧</h2>
                    <p>八百藤で使用している主な農具です。正しく使って安全に作業しましょう。</p>

                    <div className={styles.itemGrid}>
                        {tools.map((tool) => (
                            <div key={tool.name} className={styles.itemCard}>
                                <div className={styles.itemImage}>
                                    <img src={tool.image} alt={tool.name} />
                                </div>
                                <div className={styles.itemContent}>
                                    <h4>{tool.name}</h4>
                                    <p>{tool.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.tip}>
                        <strong>💡 農具の扱い方</strong>
                        <p>
                            使用後は土を落として乾かし、錆びないように保管しましょう。
                            刃物は定期的に研いで切れ味を保ちます。
                        </p>
                    </div>

                    <h2>肥料一覧</h2>
                    <p>
                        八百藤で使用している主な肥料です。
                        適切な量を守って使用しましょう。
                    </p>

                    <div className={styles.itemGrid}>
                        {fertilizers.map((fertilizer) => (
                            <div key={fertilizer.name} className={styles.itemCard}>
                                <div className={styles.itemImage}>
                                    <img src={fertilizer.image} alt={fertilizer.name} />
                                </div>
                                <div className={styles.itemContent}>
                                    <h4>{fertilizer.name}</h4>
                                    <p>{fertilizer.description}</p>
                                    <p className={styles.usage}><strong>使い方：</strong>{fertilizer.usage}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.tip}>
                        <strong>⚠️ 注意事項</strong>
                        <p>
                            肥料は与えすぎると「肥料やけ」を起こし、作物が枯れることがあります。
                            適量を守って使用しましょう。特に窒素系肥料は注意が必要です。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
