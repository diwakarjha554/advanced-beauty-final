import Image from 'next/image';
import React from 'react';

interface ReviewsCardProps {
    name: string;
    imageSrc?: string;
    reviewText: string;
    isLoading: boolean;
}

const ReviewsCard: React.FC<ReviewsCardProps> = React.memo(({ name, imageSrc, reviewText, isLoading }) => (
    <div className="flex flex-col items-center sm:px-7 md:px-14 lg:px-20 transition">
        {isLoading ? (
            <div className="animate-pulse flex flex-col items-center">
                <div className="bg-gray-300 h-10 w-64 rounded mb-2" />
                <div className="border border-gray-300 w-full max-w-[400px] h-1 mt-10" />
                <div className="bg-gray-300 h-16 w-16 rounded-full mt-10" />
                <div className="bg-gray-300 h-6 w-32 rounded mt-3" />
            </div>
        ) : (
            <>
                <p className="text-center text-xl">{reviewText}</p>
                <div className="border border-black w-full max-w-[400px] mt-10" />
                <Image
                    src={imageSrc || '/noProfile.webp'}
                    alt={`${name}'s profile picture`}
                    width={65}
                    height={65}
                    className="object-contain rounded-full select-none mt-10"
                />
                <h4 className="mt-3 text-lg font-medium">{name}</h4>
            </>
        )}
    </div>
));

ReviewsCard.displayName = 'ReviewsCard';

export default ReviewsCard;
