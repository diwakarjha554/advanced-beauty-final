'use client';
import React, { useState, useEffect } from 'react';
import styles from '@/components/home/hero-section/style.module.css';
import { Roboto_Slab } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa6';

const roboslab = Roboto_Slab({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

interface SlideImage {
    src: string;
    heading: string;
    alt: string;
}

const slides: SlideImage[] = [
    {
        src: '/section-images/heroSection/SLIDE_01.jpg',
        heading: 'Art Manicure',
        alt: 'Art Manicure Slide 1',
    },
    {
        src: '/section-images/heroSection/SLIDE_03.jpg',
        heading: 'Art Manicure',
        alt: 'Art Manicure Slide 2',
    },
    {
        src: '/section-images/heroSection/SLIDE_04.jpg',
        heading: 'Art Manicure',
        alt: 'Art Manicure Slide 3',
    },
];

const HeroSection: React.FC = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 7000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={`${styles.heroSection} h-[600px] md:h-[700px] lg:h-screen`}>
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`${styles.imageContainer} ${index === currentImageIndex ? styles.active : ''}`}
                >
                    <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        priority={true}
                        quality={90}
                        sizes="100vw"
                        className="object-cover"
                    />
                    <div className={`${styles.content} flex flex-col w-full items-center text-white`}>
                        <span
                            className={`${styles.heroSubTitleOne} select-none font-medium font-quentin leading-tight z-[5] text-[#D9C1A3]`}
                        >
                            nail fashion
                        </span>
                        <h1 className={`${styles.heroMainTitle} ${roboslab.className} uppercase leading-tight`}>
                            {slide.heading}
                        </h1>
                        <div className="mt-4 flex flex-col sm:flex-row gap-2 overflow-hidden">
                            <div>Best quality.</div>
                            <div>Always in trend.</div>
                            <div>Creative color styles.</div>
                        </div>
                        <Link
                            href={'/'}
                            className={`${styles.buyNowButton} border border-white hover:bg-white hover:text-black transition-all duration-300 mt-10 px-5 py-3 flex items-center gap-2 text-xs sm:text-sm lg:text-base font-medium`}
                        >
                            Buy Now
                            <FaArrowRight />
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HeroSection;
