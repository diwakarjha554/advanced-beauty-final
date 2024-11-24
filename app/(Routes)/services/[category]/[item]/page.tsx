import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { fetchOneServiceItems } from '@/actions/admin/service/service-item.actions';
import ServiceItemDetailClient from '@/components/services/service-item/service-item-detail';
import ServiceItemDetailLoading from '@/components/services/service-item/service-item-loading';

interface PageProps {
    params: Promise<{
        item: string;
    }>;
}

const formatUrlToTitle = (urlString: string) => {
    return urlString
        .split('-')
        .map((word) => {
            if (word.toLowerCase() === 'and') return '&';
            return word.charAt(0).toLowerCase() + word.slice(1);
        })
        .join(' ');
};

const page = async ({ params }: PageProps) => {
    const resolvedParams = await params;
    const serviceItemTitle = formatUrlToTitle(resolvedParams.item);
    const response = await fetchOneServiceItems(serviceItemTitle);

    if (!response.success || !response.items) {
        notFound();
    }

    const service = response.items.find((s) => s.title === serviceItemTitle);

    if (!service) {
        notFound();
    }

    return (
        <Suspense fallback={<ServiceItemDetailLoading />}>
            <ServiceItemDetailClient service={service} />
        </Suspense>
    );
};

export default page;
