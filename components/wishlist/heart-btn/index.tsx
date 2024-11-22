'use client';

import React from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import useWishlist from '@/hooks/use-wishlist';

interface HeartButtonProps {
    listingId: string;
}

const HeartButton: React.FC<HeartButtonProps> = ({ listingId }) => {
    const { hasWishlisted, toggleWishlist } = useWishlist({ listingId });

    return (
        <div
            onClick={toggleWishlist}
            className="relative hover:opacity-80 transition cursor-pointer"
            role="button"
            aria-label={hasWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <AiOutlineHeart size={28} className="fill-white absolute -top-[2px] -right-[2px]" />
            <AiFillHeart size={24} className={hasWishlisted ? 'fill-red-500' : 'fill-neutral-500/70'} />
        </div>
    );
};

export default HeartButton;
