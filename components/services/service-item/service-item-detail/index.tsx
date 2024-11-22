import React from 'react';

import Container from '@/components/ui/features/Container';
import Section from '@/components/ui/features/Section';
import { Skeleton } from '@/components/ui/skeleton';
import { notFound } from 'next/navigation';
import { fetchOneServiceItems, ServiceItem } from '@/actions/admin/service/service-item.actions';
import Image from 'next/image';

interface PageProps {
    params: Promise<{
        item: string;
    }>;
}

interface ServiceItemResponse {
    success: boolean;
    items?: ServiceItem[]; // Assuming `ServiceItem` is your type
    error?: string;
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

async function ServiceItemDetail({ params }: PageProps) {
    const resolvedParams = await params;
    const serviceItemTitle = formatUrlToTitle(resolvedParams.item);
    console.log(serviceItemTitle);
    const response: ServiceItemResponse = await fetchOneServiceItems(serviceItemTitle); // Assuming this returns the proper structure
    console.log(response.items);
    // Check if the response is successful and has items
    if (!response.success || !response.items) {
        notFound(); // Handle the case where no items were found or response was unsuccessful
    }

    const services = response.items; // Now `services` is properly typed as `ServiceItem[]`
    const service = services.find((s) => s.title === serviceItemTitle);

    if (!service) {
        notFound(); // If the service isn't found, handle that case
    }

    // Calculate discounted price and percentage with rounding
    const hasDiscount = service.discount > 0;
    const discountAmount = hasDiscount ? Math.round((service.price * service.discount) / 100) : 0;
    const discountedPrice = hasDiscount ? Math.round(service.price - discountAmount) : service.price;

    return (
        <Section className="py-12 md:py-16 lg:py-20 bg-gray-50">
            <Container className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                    {/* Image Section - Enhanced */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                        <Image
                            src={service.imageSrc}
                            alt={service.title}
                            width={1000}
                            height={1000}
                            className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Content Section - Enhanced */}
                    <div className="flex flex-col">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">{service.title}</h1>
                        <p className="mb-2 text-gray-700">
                            <strong>Category: </strong>
                            {service.category}
                        </p>
                        <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

                        {/* Price Section - With rounded values */}
                        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                            <div className="flex flex-col">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-bold text-primary">
                                        ₹{discountedPrice.toLocaleString()}
                                    </span>
                                    {hasDiscount && (
                                        <>
                                            <span className="text-gray-400 line-through text-xl">
                                                ₹{service.price.toLocaleString()}
                                            </span>
                                            <span className="text-green-600 text-sm font-semibold">
                                                {service.discount}% OFF
                                            </span>
                                        </>
                                    )}
                                </div>
                                {hasDiscount && (
                                    <div className="mt-2 space-y-1">
                                        <span className="inline-block text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">
                                            Save ₹{discountAmount.toLocaleString()} on this service!
                                        </span>
                                        <p className="text-sm text-gray-600">
                                            Limited time offer - Book now to avail the discount
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Booking Form - Enhanced */}
                        <form className="space-y-7">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Preferred Date
                                </label>
                                <input type="date" id="date" className="mt-1 block w-full shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                                    Preferred Time
                                </label>
                                <select id="time" className="mt-1 block w-full shadow-sm">
                                    <option>09:00 AM</option>
                                    <option>10:00 AM</option>
                                    <option>11:00 AM</option>
                                    <option>12:00 PM</option>
                                    <option>02:00 PM</option>
                                    <option>03:00 PM</option>
                                    <option>04:00 PM</option>
                                    <option>05:00 PM</option>
                                </select>
                            </div>

                            {/* Buttons Container */}
                            <div className="flex gap-4 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    Book Now
                                </button>
                                {/* <button
                                    type="button"
                                    className="flex-1 border-2 border-primary text-primary py-3 px-4 rounded-lg hover:bg-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    Add to Cart
                                </button> */}
                            </div>
                        </form>
                    </div>
                </div>
            </Container>
        </Section>
    );
}

// Loading state component
function ServiceItemDetailLoading() {
    return (
        <Section className="py-12 md:py-16 lg:py-20">
            <Container className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    <Skeleton className="aspect-[4/3] rounded-xl" />
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-12 w-1/3" />
                        <div className="space-y-4 mt-8">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
}

export function loading() {
    return <ServiceItemDetailLoading />;
}

export default ServiceItemDetail;
