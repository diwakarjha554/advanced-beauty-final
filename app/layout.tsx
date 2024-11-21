import type { Metadata } from 'next';
import localFont from 'next/font/local';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import ClientInitializer from '@/components/ui/features/ClientInitializer';

const customFont = localFont({
    src: [
        {
            path: '../public/fonts/quentin.ttf',
            weight: '400',
        },
    ],
    variable: '--font-quentin',
});

export const metadata: Metadata = {
    title: {
        default: 'Advanced Beauty | Best Home Salon',
        template: '%s',
    },
    description:
        'Experience premium salon services from the comfort of your home in Noida, Greater Noida, and Delhi NCR. Skip the hassle of traveling to a salon—our expert team brings professional treatments right to your doorstep. Enjoy the luxury of personalized beauty care without stepping out!',
    icons: {
        icon: '/icon.png',
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const currentUser = await getCurrentUser();
    return (
        <html lang="en">
            <body className={`${customFont.variable} antialiased`}>
                <ClientInitializer initialUser={currentUser} />
                <NextTopLoader color="#FF5956" height={3} showSpinner={false} />
                {children}
            </body>
        </html>
    );
}
