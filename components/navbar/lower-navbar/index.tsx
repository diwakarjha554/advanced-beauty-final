'use client';

import React from 'react';
import Section from '@/components/ui/features/Section';
import Container from '@/components/ui/features/Container';
import Logo from '@/components/ui/features/Logo';
import Navlinks from '@/components/navbar/lower-navbar/navlinks';
import Link from 'next/link';
import { BsCart2 } from 'react-icons/bs';
import Menu from '@/components/navbar/lower-navbar/menu';
import IconLink from '@/components/footer/footer-bar/icon-link';
import { BiSolidOffer } from 'react-icons/bi';
import { Toaster } from 'react-hot-toast';
import useCurrentUserStore from '@/store/auth/currentUserStore';
import { signOut } from 'next-auth/react';

const LowerNavbar = () => {
    const { currentUser } = useCurrentUserStore();
    return (
        <Section className="py-2 shadow bg-[#111111] text-white">
            <Container className="w-full flex items-center justify-between gap-20">
                <Logo className="" />
                <div className="flex items-center justify-center gap-4 lg:hidden">
                    <IconLink activeIcon={BiSolidOffer} icon={BiSolidOffer} href="/offers" />
                    <Menu />
                </div>
                <div className="hidden lg:flex items-center gap-5">
                    <Navlinks />
                    <Link href={'/cart'} className="bg-[#D9C1A3] p-2 rounded-full text-neutral-950">
                        <BsCart2 size={20} strokeWidth={0.2} />
                    </Link>
                    {currentUser ? (
                        <>
                            {currentUser.isAdmin ? (
                                <Link
                                    href={'/admin/dashboard'}
                                    className="bg-[#D9C1A3] rounded-[2px] p-2 text-neutral-950 font-semibold text-sm"
                                >
                                    <span>Dashboard</span>
                                </Link>
                            ) : (
                                <button
                                    onClick={() => signOut()}
                                    className="bg-[#D9C1A3] rounded-[2px] p-2 text-neutral-950 font-semibold text-sm"
                                >
                                    <span>LOGOUT</span>
                                </button>
                            )}
                        </>
                    ) : (
                        <Link
                            href={'/auth'}
                            className="bg-[#D9C1A3] rounded-[2px] p-2 text-neutral-950 font-semibold text-sm"
                        >
                            <span>LOGIN</span>
                        </Link>
                    )}
                </div>
            </Container>
            <Toaster position="top-center" />
        </Section>
    );
};

export default LowerNavbar;
