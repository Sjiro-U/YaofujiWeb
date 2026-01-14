import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, Users, Calendar, Sprout, Sun, Droplets } from 'lucide-react';
import styles from './page.module.css';
import GallerySlideshow from '@/components/GallerySlideshow';

// モックニュースデータ
const newsItems = [
  {
    id: 1,
    date: '2026.01.05',
    title: '新年初の畑作業を行いました！',
    category: 'イベント',
  },
  {
    id: 2,
    date: '2025.12.20',
    title: '冬野菜の収穫祭を開催します',
    category: 'お知らせ',
  },
  {
    id: 3,
    date: '2025.12.10',
    title: '大根とほうれん草が収穫時期を迎えました',
    category: '栽培報告',
  },
];

// 活動の特徴
const features = [
  {
    icon: Sprout,
    title: '初心者歓迎',
    description: '農業経験ゼロでも大丈夫！先輩が丁寧に教えます。',
  },
  {
    icon: Users,
    title: 'チームワーク',
    description: '仲間と協力して作物を育てる達成感を味わえます。',
  },
  {
    icon: Sun,
    title: '自然と触れ合う',
    description: '土に触れ、太陽の下で心身ともにリフレッシュ。',
  },
  {
    icon: Droplets,
    title: '新鮮野菜',
    description: '自分たちで育てた野菜を収穫して味わえます。',
  },
];

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* ヒーローセクション */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image
            src="/hero-farm.png"
            alt="八百藤の畑風景"
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <Leaf size={16} />
            <span>農業サークル</span>
          </div>
          <h1 className={styles.heroTitle}>
            土に触れ、<br />
            仲間と育てる<br />
            <span className={styles.heroAccent}>喜びを。</span>
          </h1>
          <p className={styles.heroDescription}>
            大学サークル「八百藤」では、キャンパス近くの畑で<br />
            季節の野菜を育てながら、自然の豊かさを学んでいます。
          </p>
          <div className={styles.heroCta}>
            <Link href="/join" className="btn btn-accent">
              入部案内を見る
              <ArrowRight size={18} />
            </Link>
            <Link href="/about" className="btn btn-secondary">
              活動を知る
            </Link>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className={`section ${styles.features}`}>
        <div className="container">
          <h2 className="section-title">八百藤の魅力</h2>
          <div className={`grid grid-4 ${styles.featureGrid}`}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <feature.icon size={32} />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ニュースセクション */}
      <section className={`section ${styles.news}`}>
        <div className="container">
          <h2 className="section-title">お知らせ</h2>
          <div className={styles.newsList}>
            {newsItems.map((news) => (
              <article key={news.id} className={styles.newsItem}>
                <div className={styles.newsDate}>{news.date}</div>
                <span className={styles.newsCategory}>{news.category}</span>
                <h3 className={styles.newsTitle}>{news.title}</h3>
              </article>
            ))}
          </div>
          <div className={styles.newsMore}>
            <Link href="/about#schedule" className="btn btn-secondary">
              活動について詳しく見る
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 活動風景セクション */}
      <GallerySlideshow />

      {/* CTAセクション */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>一緒に野菜を育てませんか？</h2>
            <p className={styles.ctaDescription}>
              経験不問！農業に興味がある方、自然が好きな方、<br />
              新しい仲間と出会いたい方、お待ちしています。
            </p>
            <Link href="/join" className="btn btn-primary">
              入部案内を見る
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
