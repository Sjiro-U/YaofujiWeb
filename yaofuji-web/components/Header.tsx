'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Leaf, User } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'ホーム' },
        { href: '/about', label: '活動紹介' },
        { href: '/join', label: '入部案内' },
    ];

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <Leaf className={styles.logoIcon} />
                    <span className={styles.logoText}>八百藤</span>
                </Link>

                <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
                    <ul className={styles.navList}>
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={styles.navLink}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Link
                        href="/login"
                        className={styles.loginBtn}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <User size={18} />
                        <span>部員ログイン</span>
                    </Link>
                </nav>

                <button
                    className={styles.menuBtn}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="メニューを開く"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </header>
    );
}
