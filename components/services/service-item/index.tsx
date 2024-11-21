import { getServiceCategory } from '@/actions/service/service-category.actions';
import { getServiceItems } from '@/actions/service/service-item.actions';
import Container from '@/components/ui/features/Container';
import Section from '@/components/ui/features/Section';
import { notFound } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

interface PageProps {
    params: {
        category: string;
    };
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
    const categoryTitle = formatUrlToTitle(params.category);

    // Fetch category to verify it exists
    const categories = await getServiceCategory();
    const categoryExists = categories.some((cat) => cat.title.toLowerCase() === categoryTitle.toLowerCase());

    if (!categoryExists) {
        notFound();
    }

    // Updated: Fetch services filtered by category
    
    let services = await getServiceItems(categoryTitle);
    console.log(services);

    const formatUrlString = (title: string) => {
        return title
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    // Updated: Define YourServiceType interface
    interface YourServiceType {
        id: string;
        title: string;
        description: string;
        price: number;
        discount: number;
        imageSrc: string;
    }

    return (
        <Section className="py-12 md:py-16 lg:py-20">
            <Container className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 md:mb-12 text-center">{categoryTitle}</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {services.map((service: YourServiceType) => (
                        <div
                            key={service.id}
                            className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
                        >
                            <div className="relative aspect-[4/3] mb-4">
                                <img
                                    src={service.imageSrc}
                                    alt={service.title}
                                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                                />
                            </div>
                            <h2 className="text-2xl font-semibold mb-3 line-clamp-2">{service.title}</h2>
                            <p className="text-gray-600 mb-4 line-clamp-3 text-sm md:text-base">
                                {service.description}
                            </p>
                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-bold text-primary">
                                        ₹{service.price - service.discount}
                                    </span>
                                    {service.discount > 0 && (
                                        <span className="text-gray-400 line-through text-sm">₹{service.price}</span>
                                    )}
                                </div>
                                <Link
                                    href={`/services/${params.category}/${formatUrlString(service.title)}`}
                                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
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
