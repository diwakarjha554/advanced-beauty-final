import GetShopItem from '@/components/shop/shop-item';
import React from 'react';

interface PageProps {
    params: Promise<{
        category: string;
    }>;
}

const page  = async ({ params }: PageProps) => {
    // Create a Promise that resolves with the params
    const paramsPromise = Promise.resolve(params);
    return <GetShopItem params={paramsPromise} />;
};

export default page;
