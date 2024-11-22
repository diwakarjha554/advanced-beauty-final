import Image from 'next/image';
import React from 'react'

interface ShopCardProps {
    src?: string;
    title: string;
    price: number;
}

const ShopCard: React.FC<ShopCardProps> = ({src, title, price}) => {
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
                <span className='uppercase text-sm'>
                    category
                </span>
                <span className='uppercase underline font-semibold text-lg'>
                    {title}
                </span>
                <div className='flex gap-5'>
                    <span className="uppercase font-semibold text-lg text-neutral-400">&#8377;<s>{price}</s></span>
                    <span className='uppercase font-semibold text-lg text-red-700'>
                        &#8377;{price}
                    </span>
                </div>
            </div>
        </div>
  )
}

export default ShopCard;