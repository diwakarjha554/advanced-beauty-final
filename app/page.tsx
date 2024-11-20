import React from 'react';
import Navbar from '@/components/navbar';
import FooterBar from '@/components/footer/footer-bar';
import Footer from '@/components/footer';
import HeroSection from '@/components/home/hero-section';
import HomeServiceSection from '@/components/home/service-section';

const page = () => {
    
    return (
        <main className="flex min-h-screen flex-col items-center justify-start min-w-screen overflow-x-hidden relative">
            <Navbar />
            <HeroSection />
            <HomeServiceSection />
            <FooterBar />
            <Footer />
        </main>
    );
};

export default page;
