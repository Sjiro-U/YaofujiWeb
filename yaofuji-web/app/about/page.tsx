import Image from 'next/image';
import { Calendar, Users, Leaf, Award, Sun, CloudRain, Snowflake, Flower2 } from 'lucide-react';
import styles from './page.module.css';

// 年間スケジュール
const yearlySchedule = [
    {
        season: '春',
        icon: Flower2,
        color: 'pink',
        months: '3月〜5月',
        activities: [
            '春合宿',
            '新入部員歓迎会',
            '春野菜の植え付け',
            'こまめな管理作業',
        ],
    },
    {
        season: '夏',
        icon: Sun,
        color: 'orange',
        months: '6月〜8月',
        activities: [
            '夏合宿',
            'こまめな水やり・除草',
            '夏野菜の収穫祭',
            '秋冬野菜の準備',
        ],
    },
    {
        season: '秋',
        icon: Leaf,
        color: 'brown',
        months: '9月〜11月',
        activities: [
            '冬野菜の植え付け',
            'サツマイモ掘り',
            '収穫感謝祭',
            '畑の片付け・冬支度',
        ],
    },
    {
        season: '冬',
        icon: Snowflake,
        color: 'blue',
        months: '12月〜2月',
        activities: [
            '冬野菜の収穫',
            'しめ縄づくり・餅つき',
            '来年度の計画立案',
            '鍋パーティ',
        ],
    },
];



export default function AboutPage() {
    return (
        <div className={styles.page}>
            {/* ヒーローセクション */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>活動紹介</h1>
                    <p className={styles.heroDescription}>
                        四季折々の農作業を通じて、<br />
                        仲間とともに成長する一年をご紹介します。
                    </p>
                </div>
            </section>

            {/* サークル概要 */}
            <section className={`section ${styles.overview}`}>
                <div className="container">
                    <div className={styles.overviewGrid}>
                        <div className={styles.overviewText}>
                            <h2 className="section-title" style={{ textAlign: 'left' }}>八百藤について</h2>
                            <p>
                                「八百藤」は1992年に設立された、大学公認の農業サークルです。
                                キャンパスに隣接する約150㎡の畑で、年間を通じて様々な野菜を栽培しています。
                            </p>
                            <p>
                                農業未経験の学生がほとんどですが、先輩から後輩へと技術を受け継ぎながら、
                                毎年おいしい野菜を収穫しています。収穫した野菜は部員で分け合ったり、
                                料理して食べたりしています。
                            </p>
                            <div className={styles.stats}>
                                <div className={styles.statItem}>
                                    <Users size={24} />
                                    <div>
                                        <span className={styles.statNumber}>30+</span>
                                        <span className={styles.statLabel}>名の部員</span>
                                    </div>
                                </div>
                                <div className={styles.statItem}>
                                    <Leaf size={24} />
                                    <div>
                                        <span className={styles.statNumber}>30+</span>
                                        <span className={styles.statLabel}>種類の野菜</span>
                                    </div>
                                </div>
                                <div className={styles.statItem}>
                                    <Award size={24} />
                                    <div>
                                        <span className={styles.statNumber}>30+</span>
                                        <span className={styles.statLabel}>年の歴史</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.overviewImage}>
                            <Image
                                src="/team-harvest.png"
                                alt="部員の活動風景"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 年間スケジュール */}
            <section className={`section ${styles.schedule}`}>
                <div className="container">
                    <h2 className="section-title">
                        <Calendar size={32} style={{ display: 'inline', marginRight: '8px' }} />
                        年間スケジュール
                    </h2>
                    <div className={styles.seasonGrid}>
                        {yearlySchedule.map((season) => (
                            <div key={season.season} className={styles.seasonCard} data-color={season.color}>
                                <div className={styles.seasonHeader}>
                                    <season.icon size={28} />
                                    <h3>{season.season}</h3>
                                    <span className={styles.seasonMonths}>{season.months}</span>
                                </div>
                                <ul className={styles.activityList}>
                                    {season.activities.map((activity, index) => (
                                        <li key={index}>{activity}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 部員の声 */}
            <section className={`section ${styles.testimonials}`}>
                <div className="container">
                    <h2 className="section-title">部員の声</h2>
                    <div className={styles.testimonialList}>
                        <div className={styles.testimonialCard}>
                            <div className={styles.testimonialHeader}>
                                <span className={styles.testimonialGrade}>3年生</span>
                                <span className={styles.testimonialName}>Aさん</span>
                            </div>
                            <p>
                                農業は初めてでしたが、先輩が丁寧に教えてくれるので安心でした。
                                自分で育てた野菜を収穫したときの達成感は格別です！
                            </p>
                        </div>
                        <div className={styles.testimonialCard}>
                            <div className={styles.testimonialHeader}>
                                <span className={styles.testimonialGrade}>2年生</span>
                                <span className={styles.testimonialName}>Bさん</span>
                            </div>
                            <p>
                                毎週土曜日の活動が良いリフレッシュになっています。
                                学部を超えた仲間ができたのも嬉しいポイントです。
                            </p>
                        </div>
                        <div className={styles.testimonialCard}>
                            <div className={styles.testimonialHeader}>
                                <span className={styles.testimonialGrade}>4年生</span>
                                <span className={styles.testimonialName}>Cさん</span>
                            </div>
                            <p>
                                授業だけでは学べない、実践的な農業体験ができます。
                                就活でもこの経験を話すと興味を持ってもらえることが多いです。
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
