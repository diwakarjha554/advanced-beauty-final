import Footer from '@/components/footer';
import FooterBar from '@/components/footer/footer-bar';
import HomeSubscribeNewsletter from '@/components/home/subscribe-newsletter';
import ScrollToTop from '@/components/ui/features/ScrollToTop';
// import HomeSubscribeNewsletter from '@/components/home/subscribe-newsletter';
import NavbarMarginLayout from '@/components/ui/navbar-margin-layout';
import { WhatsAppSolid } from '@/public/svgs';
import React from 'react';

interface RoutesLayoutProps {
    children: React.ReactNode;
}

const RoutesLayout: React.FC<RoutesLayoutProps> = ({ children }) => {
    return (
        <NavbarMarginLayout>
            <main className="flex flex-col items-center justify-start w-full overflow-x-hidden">
                <div className="fixed bottom-24 lg:bottom-10 right-3 cursor-pointer flex flex-col gap-3 z-40">
                    <ScrollToTop />
                    <a
                        href={`https://api.whatsapp.com/send?phone=%2B918826207080`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className=""
                    >
                        <WhatsAppSolid
                            height="2.5rem"
                            width="2.5rem"
                            fillColor="#FF5956"
                            strokeWidth="0"
                            strokeColor="currentColor"
                        />
                    </a>
                </div>
                {children}
                <HomeSubscribeNewsletter />
                <FooterBar />
                <Footer />
            </main>
        </NavbarMarginLayout>
    );
};

export default RoutesLayout;
