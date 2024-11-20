import React from 'react';
import Image from 'next/image';

interface ServicecardProps {
    src?: string;
    title: string;
    price: number;
}

const Servicecard: React.FC<ServicecardProps> = ({ src, title, price }) => {
    return (
        <div className="group w-full cursor-pointer relative">
            <div className="relative overflow-hidden h-[230px]">
                <Image
                    fill
                    src={src || '/SLIDE_01.jpg'}
                    alt="serviceImg"
                    className="object-cover group-hover:scale-110 transition-all ease-in-out duration-300 select-none"
                />
            </div>
            <div className="w-full flex flex-col items-center justify-center py-4 gap-2">
                <span className="uppercase underline font-semibold text-lg">{title}</span>
                <div className="flex gap-5">
                    {/* <span className="uppercase font-semibold text-lg">&#8377;<s>{price}</s></span> */}
                    <span className="uppercase font-semibold text-lg">&#8377;{price}</span>
                </div>
            </div>
        </div>
    );
};

export default Servicecard;
