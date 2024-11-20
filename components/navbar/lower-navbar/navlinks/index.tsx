import ActiveLink from '@/components/ui/features/ActiveLink';
import React from 'react';

const Navlinks = () => {
    return (
        <div className="flex gap-4 font-semibold">
            <ActiveLink href="/" text="Home" />
            <ActiveLink href="/services" text="Services" />
            <ActiveLink href="/shop" text="Shop" />
            <ActiveLink href="/offers" text="Offers" />
            <ActiveLink href="/wishlist" text="Wishlist" />
        </div>
    );
};

export default Navlinks;
