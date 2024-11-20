import type { Metadata } from 'next';
import './globals.css';

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`antialiased`}>{children}</body>
        </html>
    );
}
