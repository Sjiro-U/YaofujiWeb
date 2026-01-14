'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { ArrowLeft } from 'lucide-react';
import styles from '../page.module.css';

export default function RidgeManualPage() {
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
                    <h1>畝の作り方マニュアル</h1>
                    <p className={styles.subtitle}>基本の畝立て手順を学ぼう</p>
                </div>

                {/* コンテンツ */}
                <div className={styles.content}>
                    <h2>1. 畝とは？</h2>
                    <p>
                        畝（うね）とは、畑に作る土の山のことです。野菜を植える場所を高くすることで、水はけがよくなり、作物の根腐れを防ぎます。
                        また、畝を作ることで作業通路が確保され、管理がしやすくなります。
                    </p>

                    <h2>2. 必要な道具</h2>
                    <ul>
                        <li><strong>クワ（鍬）</strong>：土を掘り起こし、畝を成形するのに使用</li>
                        <li><strong>レーキ</strong>：土の表面をならすのに使用</li>
                        <li><strong>メジャー・巻尺</strong>：畝のサイズを測定</li>
                        <li><strong>紐・ロープ</strong>：まっすぐな畝を作るためのガイドライン</li>
                        <li><strong>杭</strong>：紐を固定するために使用</li>
                    </ul>

                    <h2>3. フィールドゆうの畝サイズ</h2>
                    <p>フィールドゆうでは、以下のサイズで畝を作っています：</p>
                    <ul>
                        <li><strong>畝の長さ</strong>：約2.7m</li>
                        <li><strong>畝の幅</strong>：約0.9m（90cm）</li>
                        <li><strong>畝の高さ</strong>：約15〜20cm</li>
                        <li><strong>通路幅</strong>：約40〜50cm</li>
                    </ul>

                    <h2>4. 畝の作り方手順</h2>
                    <h3>ステップ1：土を耕す</h3>
                    <p>
                        まず、畑全体をクワで掘り起こし、土を柔らかくします。石やゴミがあれば取り除きましょう。
                        深さは20〜30cm程度を目安に耕します。
                    </p>

                    <h3>ステップ2：ガイドラインを引く</h3>
                    <p>
                        杭と紐を使って、畝を作る位置にまっすぐなラインを引きます。
                        これにより、きれいな畝を作ることができます。
                    </p>

                    <h3>ステップ3：土を盛る</h3>
                    <p>
                        通路になる部分の土をクワで掘り、畝になる部分に盛っていきます。
                        両側から均等に土を盛ることで、中央が高くなる形になります。
                    </p>

                    <h3>ステップ4：表面をならす</h3>
                    <p>
                        レーキを使って畝の表面をならします。
                        表面がなめらかになることで、種まきや苗の植え付けがしやすくなります。
                    </p>

                    <h3>ステップ5：完成！</h3>
                    <p>
                        畝が完成したら、すぐに植え付けを行うか、マルチ（ビニールシート）で覆って保護します。
                    </p>

                    <div className={styles.tip}>
                        <strong>💡 ポイント</strong>
                        <p>
                            畝は作物の種類によって高さを変えましょう。水はけを良くしたい野菜（トマト、ナスなど）は高畝（20cm以上）、
                            水を好む野菜（サトイモなど）は低畝（10cm程度）にします。
                        </p>
                    </div>

                    <h2>5. よくある失敗と対策</h2>
                    <ul>
                        <li>
                            <strong>畝が崩れる</strong>：土をしっかり押し固めましょう。水をかけて落ち着かせるのも効果的です。
                        </li>
                        <li>
                            <strong>畝が曲がる</strong>：紐でガイドラインを引いてから作業しましょう。
                        </li>
                        <li>
                            <strong>高さが均一でない</strong>：レーキで調整し、何度か確認しながら作業しましょう。
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
