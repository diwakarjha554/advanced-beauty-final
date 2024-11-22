import React from 'react';
import ServiceItemDetail from '@/components/services/service-item/service-item-detail';

interface PageProps {
    params: Promise<{
        item: string;
    }>;
}

const page = async ({ params }: PageProps) => {
    // Create a Promise that resolves with the params
    const paramsPromise = Promise.resolve(params);
    return <ServiceItemDetail params={paramsPromise} />;
};

export default page;
