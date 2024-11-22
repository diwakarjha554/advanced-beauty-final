'use client';

import React from 'react';
import Section from '../ui/features/Section';
import Container from '../ui/features/Container';
import useCurrentUserStore from '@/store/auth/currentUserStore';
import Link from 'next/link';

const Wishlist = () => {
    const { currentUser } = useCurrentUserStore();
    return (
        <Section className="py-10 md:py-20 mb-20 min-h-[600px]">
            <Container>
                {currentUser ? (
                    <div>Welcome back, {currentUser.name}!</div>
                ) : (
                    <div className="flex flex-col gap-7">
                        <div className="flex flex-col gap-[3px]">
                            <span className="text-2xl font-semibold">No login detected</span>
                            <span className="font-medium">
                                Looks like you are not logged in. Please log in to view your Wishlist.
                            </span>
                        </div>
                        <Link
                            href={'/auth'}
                            className="bg-[#D9C1A3] rounded-[2px] py-2 px-3 text-neutral-950 font-semibold text-sm w-fit"
                        >
                            <span>LOGIN</span>
                        </Link>
                    </div>
                )}
            </Container>
        </Section>
    );
};

export default Wishlist;
