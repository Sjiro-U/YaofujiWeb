'use client';

import { useState } from 'react';
import { MapPin, Clock, Users, Mail, Send, CheckCircle } from 'lucide-react';
import styles from './page.module.css';

export default function JoinPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        grade: '',
        department: '',

        message: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // フォーム送信処理（デモではローカルのみ）
        console.log('Form submitted:', formData);
        setIsSubmitted(true);
    };

    return (
        <div className={styles.page}>
            {/* ヒーローセクション */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>入会案内</h1>
                    <p className={styles.heroDescription}>
                        農業未経験でも大歓迎！<br />
                        一緒に土に触れ、野菜を育てる喜びを体験しましょう。
                    </p>
                </div>
            </section>

            {/* 募集要項 */}
            <section className={`section ${styles.requirements}`}>
                <div className="container">
                    <h2 className="section-title">募集要項</h2>
                    <div className={styles.requirementGrid}>
                        <div className={styles.requirementCard}>
                            <div className={styles.cardIcon}>
                                <Users size={28} />
                            </div>
                            <h3>対象</h3>
                            <p>
                                本学に在籍する全学部・全学年の学生<br />
                                ＊大学院生も入会可能<br />
                                <strong>農業経験は一切不問です！</strong>
                            </p>
                        </div>
                        <div className={styles.requirementCard}>
                            <div className={styles.cardIcon}>
                                <Clock size={28} />
                            </div>
                            <h3>活動日時</h3>
                            <p>
                                毎週土曜日 9:00〜12:00<br />
                                部員の都合に合わせて平日2日<br />
                                ※参加は任意、都合の良い時間だけでOK
                            </p>
                        </div>
                        <div className={styles.requirementCard}>
                            <div className={styles.cardIcon}>
                                <MapPin size={28} />
                            </div>
                            <h3>活動場所</h3>
                            <p>
                                ・<a
                                    href="https://maps.app.goo.gl/qYSiLopbC5NrQDo38"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.locationLink}
                                >
                                    SFC近隣農地
                                </a><br />
                                ・<a
                                    href="https://maps.app.goo.gl/sR3HeMk8sysB17aZ9"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.locationLink}
                                >
                                    フィールドゆう
                                </a>
                            </p>
                        </div>
                        <div className={styles.requirementCard}>
                            <div className={styles.cardIcon}>
                                <Mail size={28} />
                            </div>
                            <h3>年会費</h3>
                            <p>
                                <strong>4,000円/年</strong><br />
                                （種苗代・道具代に充当）
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* よくある質問 */}
            <section className={`section ${styles.faq}`}>
                <div className="container">
                    <h2 className="section-title">よくある質問</h2>
                    <div className={styles.faqList}>
                        <div className={styles.faqItem}>
                            <h4>Q. 農業経験がなくても大丈夫ですか？</h4>
                            <p>A. もちろん大丈夫です！部員の9割以上が未経験からスタートしています。先輩が丁寧に教えますのでご安心ください。</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h4>Q. 毎週参加しないといけませんか？</h4>
                            <p>A. いいえ、参加は任意です。授業やアルバイトの都合に合わせて、無理のない範囲で参加してください。</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h4>Q. 必要な持ち物はありますか？</h4>
                            <p>A. 汚れても良い服装と長靴があれば十分です。道具はすべてサークルで用意しています。</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h4>Q. 見学はできますか？</h4>
                            <p>A. はい、いつでも歓迎です！下記フォームからご連絡いただくか、活動日に直接お越しください。</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* お問い合わせフォーム */}
            <section className={`section ${styles.contact}`}>
                <div className="container">
                    <h2 className="section-title">お問い合わせ・入部申込</h2>
                    <div className={styles.formContainer}>
                        {isSubmitted ? (
                            <div className={styles.successMessage}>
                                <CheckCircle size={48} />
                                <h3>送信完了しました！</h3>
                                <p>お問い合わせありがとうございます。<br />担当者から3営業日以内にご連絡いたします。</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.formRow}>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="name">お名前 *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            className="form-input"
                                            placeholder="慶應 太郎"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="email">メールアドレス *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="form-input"
                                            placeholder="example@univ.ac.jp"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className={styles.formRow}>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="grade">学年</label>
                                        <select
                                            id="grade"
                                            name="grade"
                                            className="form-input"
                                            value={formData.grade}
                                            onChange={handleChange}
                                        >
                                            <option value="">選択してください</option>
                                            <option value="1">1年生</option>
                                            <option value="2">2年生</option>
                                            <option value="3">3年生</option>
                                            <option value="4">4年生</option>
                                            <option value="other">その他（院生等）</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="department">学部・学科</label>
                                        <input
                                            type="text"
                                            id="department"
                                            name="department"
                                            className="form-input"
                                            placeholder="農学部 生物資源学科"
                                            value={formData.department}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="message">お問い合わせ内容・質問など</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        className="form-input"
                                        rows={4}
                                        placeholder="入部希望、見学希望、質問など何でもお気軽にどうぞ！"
                                        value={formData.message}
                                        onChange={handleChange}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    <Send size={18} />
                                    送信する
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
