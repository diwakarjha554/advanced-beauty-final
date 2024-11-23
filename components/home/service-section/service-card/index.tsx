'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HeartButton from '@/components/wishlist/heart-btn';

interface ServiceCardProps {
    id: string;
    src?: string;
    title: string;
    price: number;
    discount: number;
    category: string;
}

const formatUrlString = (title: string) => {
    return title
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const ServiceCard: React.FC<ServiceCardProps> = ({ id, src, title, price, discount, category }) => {
    const discountedPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
    return (
        <div className="w-full">
            <div className="relative overflow-hidden h-[230px] shadow-md">
                <div className="w-full h-full">
                    <Link
                        href={`/services/${formatUrlString(category)}/${formatUrlString(title)}`}
                        className="block w-full h-full"
                    >
                        <div className="w-full h-full relative">
                            <Image
                                fill
                                src={src || '/SLIDE_01.jpg'}
                                alt={title}
                                className="object-cover hover:scale-110 transition-all ease-in-out duration-300 select-none"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    </Link>
                </div>
                {discount > 0 && (
                    <div className="absolute top-2 left-2 bg-yellow-100 text-black text-sm font-semibold rounded w-fit h-8 flex items-center justify-center shadow-lg z-10 px-2">
                        {discount}% OFF
                    </div>
                )}
                <div className="absolute top-3 right-3 z-10">
                    <HeartButton listingId={id} />
                </div>
            </div>
            <div className="w-full flex flex-col items-center justify-center py-4 gap-2">
                <Link href={`/services/${formatUrlString(category)}`} className="text-xs uppercase hover:underline">
                    {category}
                </Link>
                <Link
                    href={`/services/${formatUrlString(category)}/${formatUrlString(title)}`}
                    className="uppercase underline font-semibold text-lg text-center px-2"
                >
                    {title}
                </Link>
                <div className="flex gap-5">
                    {discount > 0 && (
                        <s className="text-neutral-400">
                            <span className="uppercase font-semibold text-lg">₹{price}</span>
                        </s>
                    )}
                    <span className="uppercase font-semibold text-lg text-red-700">₹{discountedPrice}</span>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
