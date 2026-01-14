import Link from 'next/link';
import { Leaf, Mail, MapPin, Clock, Instagram } from 'lucide-react';
import styles from './Footer.module.css';

// Xアイコン（lucide-reactに含まれていないためカスタムで作成）
const XIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* サークル情報 */}
                    <div className={styles.section}>
                        <div className={styles.brand}>
                            <Leaf className={styles.brandIcon} />
                            <span className={styles.brandText}>八百藤</span>
                        </div>
                        <p className={styles.description}>
                            新鮮な野菜づくりを通じて、仲間と一緒に農業の楽しさを体験しよう！
                            畑仕事を通じて、自然の恵みと達成感を味わえます。
                        </p>
                    </div>

                    {/* リンク */}
                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>リンク</h4>
                        <ul className={styles.linkList}>
                            <li><Link href="/">ホーム</Link></li>
                            <li><Link href="/about">活動紹介</Link></li>
                            <li><Link href="/join">入部案内</Link></li>
                            <li><Link href="/login">部員ログイン</Link></li>
                        </ul>
                    </div>

                    {/* 連絡先 */}
                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>活動情報</h4>
                        <ul className={styles.infoList}>
                            <li>
                                <MapPin size={16} />
                                <span>SFC近隣農地 / フィールドゆう</span>
                            </li>
                            <li>
                                <Clock size={16} />
                                <span>毎週土曜 9:00 ~ 12:00<br />平日2日</span>
                            </li>
                            <li>
                                <Mail size={16} />
                                <span>yaofuji2026@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* SNS */}
                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>SNS</h4>
                        <div className={styles.socialLinks}>
                            <a
                                href="https://www.instagram.com/yaofuji_sfc/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="Instagram"
                            >
                                <Instagram size={24} />
                            </a>
                            <a
                                href="https://twitter.com/sfc_yaofuji"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="X (Twitter)"
                            >
                                <XIcon size={24} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {currentYear} 農業サークル 八百藤. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
