import { fetchShopCategories, ShopCategory } from '@/actions/admin/shop/shop-category.actions';
import { fetchShopItems, ShopItem } from '@/actions/admin/shop/shop-item.actions';
import Container from '@/components/ui/features/Container';
import Section from '@/components/ui/features/Section';
import { notFound } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import ShopCard from '@/components/home/shop-section/shop-card';

interface PageProps {
    params: Promise<{
        category: string;
    }>;
}

const formatUrlToTitle = (urlString: string) => {
    return urlString
        .split('-')
        .map((word) => {
            if (word.toLowerCase() === 'and') return '&';
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
};

function ShopItemSkeleton() {
    return (
        <div className="border border-gray-200 rounded-xl p-5 shadow-sm bg-white">
            <Skeleton className="relative aspect-[4/3] mb-4 rounded-lg" />
            <Skeleton className="h-8 w-3/4 mb-3" />
            <Skeleton className="h-16 w-full mb-4" />
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-10 w-28" />
            </div>
        </div>
    );
}

function ShopItemLoading() {
    return (
        <Section className="py-12 md:py-16 lg:py-20">
            <Container className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <Skeleton className="h-12 w-72 mx-auto mb-8 md:mb-12" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {[...Array(8)].map((_, index) => (
                        <ShopItemSkeleton key={index} />
                    ))}
                </div>
            </Container>
        </Section>
    );
}

async function GetShopItem({ params }: PageProps) {
    const resolvedParams = await params;
    const categoryTitle = formatUrlToTitle(resolvedParams.category);

    const categoriesResponse = await fetchShopCategories();

    if (!categoriesResponse.success || !categoriesResponse.categories) {
        notFound();
    }

    const categoryExists = categoriesResponse.categories.some(
        (cat: ShopCategory) => cat.title.toLowerCase() === categoryTitle.toLowerCase()
    );

    if (!categoryExists) {
        notFound();
    }

    const shopResponse = await fetchShopItems(categoryTitle);

    if (!shopResponse.success || !shopResponse.items) {
        notFound();
    }

    return (
        <Section className="py-10 md:py-16 mb-20">
            <Container className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 md:mb-12 text-center">{categoryTitle}</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {shopResponse.items.map((item: ShopItem) => (
                        <ShopCard
                            key={item.id}
                            src={item.imageSrc}
                            title={item.title}
                            price={item.price}
                            discount={item.discount}
                            category={item.category}
                            id={item.id}
                            quantity={item.quantity}
                        />
                    ))}
                </div>
            </Container>
        </Section>
    );
}

export function loading() {
    return <ShopItemLoading />;
}

export default GetShopItem;