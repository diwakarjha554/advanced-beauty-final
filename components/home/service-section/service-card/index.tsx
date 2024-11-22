import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ServicecardProps {
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

const Servicecard: React.FC<ServicecardProps> = ({ src, title, price, discount, category }) => {
    return (
        <Link
            href={`/services/${formatUrlString(category)}/${formatUrlString(title)}`}
            className="group w-full cursor-pointer relative"
        >
            <div className="relative overflow-hidden h-[230px]">
                <Image
                    fill
                    src={src || '/SLIDE_01.jpg'}
                    alt="serviceImg"
                    className="object-cover group-hover:scale-110 transition-all ease-in-out duration-300 select-none"
                />
            </div>
            <div className="w-full flex flex-col items-center justify-center py-4 gap-2">
                <span className="text-xs capitalize underline">{category}</span>
                <span className="uppercase underline font-semibold text-lg">{title}</span>
                <div className="flex gap-5">
                    <span className="uppercase font-semibold text-lg">
                        {discount > 0 ? <>&#8377;{Math.round(price * (1 - discount / 100))}</> : ''}
                    </span>
                    {discount > 0 ? (
                        <s>
                            <span className="uppercase font-semibold text-lg text-gray-500">&#8377;{price}</span>
                        </s>
                    ) : (
                        <span className="uppercase font-semibold text-lg">&#8377;{price}</span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default Servicecard;
