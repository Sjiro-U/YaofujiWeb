'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './GallerySlideshow.module.css';

// スライドショー用の画像データ
const slides = [
    {
        src: '/gallery-1.jpg',
        alt: '収穫の様子',
        caption: 'みんなで収穫',
    },
    {
        src: '/gallery-2.jpg',
        alt: '畑作業',
        caption: '土づくり作業',
    },
    {
        src: '/gallery-3.jpg',
        alt: '野菜の生育',
        caption: '元気に育つ野菜たち',
    },
    {
        src: '/gallery-4.jpg',
        alt: '部員交流',
        caption: '部員みんなで記念撮影',
    },
];

export default function GallerySlideshow() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, []);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
    };

    // 自動再生
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 5000); // 5秒ごとに切り替え

        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

    return (
        <section className={`section ${styles.gallery}`}>
            <div className="container">
                <h2 className="section-title">活動風景</h2>
                <div className={styles.slideshow}>
                    <div className={styles.slideContainer}>
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
                            >
                                <Image
                                    src={slide.src}
                                    alt={slide.alt}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    priority={index === 0}
                                />
                                <div className={styles.caption}>{slide.caption}</div>
                            </div>
                        ))}
                    </div>

                    {/* コントロール */}
                    <button
                        className={`${styles.navBtn} ${styles.prevBtn}`}
                        onClick={prevSlide}
                        aria-label="前の画像"
                    >
                        <ChevronLeft size={28} />
                    </button>
                    <button
                        className={`${styles.navBtn} ${styles.nextBtn}`}
                        onClick={nextSlide}
                        aria-label="次の画像"
                    >
                        <ChevronRight size={28} />
                    </button>

                    {/* ドットインジケーター */}
                    <div className={styles.dots}>
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                                onClick={() => goToSlide(index)}
                                aria-label={`スライド ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
