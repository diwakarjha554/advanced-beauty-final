import React from 'react';
import GetServiceItem from '@/components/services/service-item';

interface PageProps {
    params: Promise<{
        category: string;
    }>;
}

const Page = async ({ params }: PageProps) => {
    // Create a Promise that resolves with the params
    const paramsPromise = Promise.resolve(params);
    return <GetServiceItem params={paramsPromise} />;
};

export default Page;