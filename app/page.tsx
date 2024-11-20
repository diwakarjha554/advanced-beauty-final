import React from 'react';
import Navbar from '@/components/navbar';
import FooterBar from '@/components/footer/footer-bar';
import Footer from '@/components/footer';

const page = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-start min-w-screen overflow-x-hidden relative">
            <Navbar />
            <FooterBar />
            <Footer />
        </main>
    );
};

export default page;
