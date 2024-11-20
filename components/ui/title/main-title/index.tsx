import React from 'react';

interface MainTitleProps {
    heading: string;
    subheading?: string;
    isSmallS?: boolean;
}

const MainTitle: React.FC<MainTitleProps> = ({ heading, subheading, isSmallS }) => {
    return (
        <div className="flex flex-col gap-1">
            <span className="font-bold text-2xl sm:text-3xl text-neutral-800">
                {heading}{isSmallS && <span className="text-xl">S</span>}
            </span>
            <p className="font-semibold text-xl text-neutral-500">{subheading}</p>
        </div>
    );
};

export default MainTitle;
