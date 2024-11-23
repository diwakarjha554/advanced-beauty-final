import { fetchServiceCategories, ServiceCategory } from '@/actions/admin/service/service-category.actions';
import { fetchServiceItems, ServiceItem } from '@/actions/admin/service/service-item.actions';
import Container from '@/components/ui/features/Container';
import Section from '@/components/ui/features/Section';
import { notFound } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import ServiceCard from '@/components/home/service-section/service-card';

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

function ServiceItemSkeleton() {
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

function ServiceItemLoading() {
    return (
        <Section className="py-12 md:py-16 lg:py-20">
            <Container className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <Skeleton className="h-12 w-72 mx-auto mb-8 md:mb-12" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {[...Array(8)].map((_, index) => (
                        <ServiceItemSkeleton key={index} />
                    ))}
                </div>
            </Container>
        </Section>
    );
}

async function GetServiceItem({ params }: PageProps) {
    // Wait for params to be resolved
    const resolvedParams = await params;
    const categoryTitle = formatUrlToTitle(resolvedParams.category);

    // Fetch category to verify it exists
    const categoriesResponse = await fetchServiceCategories();

    if (!categoriesResponse.success || !categoriesResponse.categories) {
        notFound();
    }

    const categoryExists = categoriesResponse.categories.some(
        (cat: ServiceCategory) => cat.title.toLowerCase() === categoryTitle.toLowerCase()
    );

    if (!categoryExists) {
        notFound();
    }

    // Fetch services filtered by category
    const servicesResponse = await fetchServiceItems(categoryTitle);

    if (!servicesResponse.success || !servicesResponse.items) {
        notFound();
    }

    return (
        <Section className="py-10 md:py-16 mb-20">
            <Container className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 md:mb-12 text-center">{categoryTitle}</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {servicesResponse.items.map((service: ServiceItem) => (
                        <ServiceCard
                            key={service.id}
                            src={service.imageSrc}
                            title={service.title}
                            price={service.price}
                            discount={service.discount}
                            category={service.category}
                            id={service.id}
                        />
                    ))}
                </div>
            </Container>
        </Section>
    );
}

export function loading() {
    return <ServiceItemLoading />;
}

export default GetServiceItem;
