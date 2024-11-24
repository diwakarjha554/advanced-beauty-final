'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export type ServiceItem = {
    id: string;
    title: string;
    imageSrc: string;
    description: string;
    price: number;
    discount: number;
    category: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
};

export async function createServiceItem(data: {
    title: string;
    imageSrc: string;
    description: string;
    price: number;
    discount: number;
    category: string;
}) {
    try {
        const item = await prisma.service.create({
            data: {
                title: data.title,
                imageSrc: data.imageSrc,
                description: data.description,
                price: data.price,
                discount: data.discount,
                category: data.category,
            },
        });
        revalidatePath('/service-items');
        return { success: true, item };
    } catch (error) {
        console.error('Create service item error:', error);
        return { success: false, error: 'Failed to create service item' };
    }
}

export async function updateServiceItem(
    id: string,
    data: {
        title?: string;
        imageSrc?: string;
        description?: string;
        price?: number;
        discount?: number; // Keep this optional
        category?: string;
    }
) {
    try {
        const item = await prisma.service.update({
            where: { id },
            data: {
                ...(data.title && { title: data.title }),
                ...(data.imageSrc && { imageSrc: data.imageSrc }),
                ...(data.description && { description: data.description }),
                ...(data.price !== undefined && { price: data.price }), // Check for undefined
                discount: data.discount !== undefined ? data.discount : undefined, // Always include discount
                ...(data.category && { category: data.category }),
            },
        });
        revalidatePath('/service-items');
        return { success: true, item };
    } catch (error) {
        console.error('Update service item error:', error);
        return { success: false, error: 'Failed to update service item' };
    }
}

export async function deleteServiceItem(id: string) {
    try {
        await prisma.service.delete({
            where: { id },
        });
        revalidatePath('/service-items');
        return { success: true };
    } catch (error) {
        console.error('Delete category error:', error);
        return { success: false, error: 'Failed to delete category' };
    }
}

export async function fetchServiceItems(categoryTitle?: string): Promise<{
    success: boolean;
    items?: ServiceItem[];
    error?: string;
}> {
    try {
        if (categoryTitle) {
            // Add some logging to see what's being queried
            const items = await prisma.service.findMany({
                where: {
                    category: {
                        equals: categoryTitle,
                        mode: 'insensitive', // Makes the search case-insensitive
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return { success: true, items };
        } else {
            const items = await prisma.service.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return { success: true, items };
        }
    } catch (error) {
        console.error('Fetch service items error:', error);
        return { success: false, error: 'Failed to fetch service items' };
    }
}

export async function fetchOneServiceItems(serviceTitle?: string): Promise<{
    success: boolean;
    items?: ServiceItem[];
    error?: string;
}> {
    try {
        if (serviceTitle) {
            const items = await prisma.service.findMany({
                where: {
                    title: {
                        equals: serviceTitle,
                        mode: 'insensitive', // Makes the search case-insensitive
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return { success: true, items };
        } else {
            // You could optionally handle the case when serviceTitle is not provided
            return { success: false, error: 'Category title is required' };
        }
    } catch (error) {
        console.error('Fetch service items error:', error);
        return { success: false, error: 'Failed to fetch service items' };
    }
}

export async function fetchSingleServiceItemFromEachCategory(): Promise<{
    success: boolean;
    items?: ServiceItem[];
    error?: string;
}> {
    try {
        const categories = await prisma.service.findMany({
            distinct: ['category'],
            select: {
                category: true,
            },
        });

        const items = await Promise.all(
            categories.map(async (category) => {
                const item = await prisma.service.findFirst({
                    where: {
                        category: {
                            equals: category.category,
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                });
                return item;
            })
        );

        return { success: true, items: items.filter((item) => item !== null) }; // Filter out null items
    } catch (error) {
        console.error('Fetch single service item from each category error:', error);
        return { success: false, error: 'Failed to fetch service items from each category' };
    }
}
