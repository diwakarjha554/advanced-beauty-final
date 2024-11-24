import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { fetchOneShopItems } from '@/actions/admin/shop/shop-item.actions';
import ShopItemDetailLoading from '@/components/shop/shop-item/shop-item-loading';
import ShopItemDetailClient from '@/components/shop/shop-item/shop-item-detail';

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
    const shopItemTitle = formatUrlToTitle(resolvedParams.item);
    const response = await fetchOneShopItems(shopItemTitle);
    if (!response.success || !response.items) {
        notFound();
    }
    const shop = response.items.find((s) => s.title === shopItemTitle);
    if (!shop) {
        notFound();
    }
    return (
        <Suspense fallback={<ShopItemDetailLoading />}>
            <ShopItemDetailClient item={shop} />
        </Suspense>
    );
};

export default page;
