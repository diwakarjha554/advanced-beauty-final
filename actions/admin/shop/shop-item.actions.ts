// actions/admin/shop/shop-item.actions.ts

'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export type ShopItem = {
    id: string;
    title: string;
    imageSrc: string;
    description: string;
    price: number;
    discount: number;
    quantity: number; // Added quantity
    category: string;
    createdAt: Date;
    updatedAt: Date;
};

export async function createShopItem(data: {
    title: string;
    imageSrc: string;
    description: string;
    price: number;
    discount: number;
    quantity: number; // Added quantity
    category: string;
}) {
    try {
        const item = await prisma.shop.create({
            data: {
                title: data.title,
                imageSrc: data.imageSrc,
                description: data.description,
                price: data.price,
                discount: data.discount,
                quantity: data.quantity, // Added quantity
                category: data.category,
            },
        });
        revalidatePath('/shop-items');
        return { success: true, item };
    } catch (error) {
        console.error('Create shop item error:', error);
        return { success: false, error: 'Failed to create shop item' };
    }
}

export async function updateShopItem(
    id: string,
    data: {
        title?: string;
        imageSrc?: string;
        description?: string;
        price?: number;
        discount?: number; // Keep this optional
        quantity?: number; // Added quantity
        category?: string;
    }
) {
    try {
        const item = await prisma.shop.update({
            where: { id },
            data: {
                ...(data.title && { title: data.title }),
                ...(data.imageSrc && { imageSrc: data.imageSrc }),
                ...(data.description && { description: data.description }),
                ...(data.price !== undefined && { price: data.price }),
                discount: data.discount !== undefined ? data.discount : undefined,
                ...(data.quantity !== undefined && { quantity: data.quantity }), // Added quantity
                ...(data.category && { category: data.category }),
            },
        });
        revalidatePath('/shop-items');
        return { success: true, item };
    } catch (error) {
        console.error('Update shop item error:', error);
        return { success: false, error: 'Failed to update shop item' };
    }
}

export async function deleteShopItem(id: string) {
    try {
        await prisma.shop.delete({
            where: { id },
        });
        revalidatePath('/shop-items');
        return { success: true };
    } catch (error) {
        console.error('Delete shop item error:', error);
        return { success: false, error: 'Failed to delete shop item' };
    }
}

export async function fetchShopItems(categoryTitle?: string): Promise<{
    success: boolean;
    items?: ShopItem[];
    error?: string;
}> {
    try {
        if (categoryTitle) {
            const items = await prisma.shop.findMany({
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
            const items = await prisma.shop.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return { success: true, items };
        }
    } catch (error) {
        console.error('Fetch shop items error:', error);
        return { success: false, error: 'Failed to fetch shop items' };
    }
}

export async function fetchOneShopItems(shopTitle?: string): Promise<{
    success: boolean;
    items?: ShopItem[];
    error?: string;
}> {
    try {
        if (shopTitle) {
            const items = await prisma.shop.findMany({
                where: {
                    title: {
                        equals: shopTitle,
                        mode: 'insensitive', // Makes the search case-insensitive
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return { success: true, items };
        } else {
            return { success: false, error: 'Shop title is required' };
        }
    } catch (error) {
        console.error('Fetch shop items error:', error);
        return { success: false, error: 'Failed to fetch shop items' };
    }
}

export async function fetchSingleShopItemFromEachCategory(): Promise<{
    success: boolean;
    items?: ShopItem[];
    error?: string;
}> {
    try {
        const categories = await prisma.shop.findMany({
            distinct: ['category'],
            select: {
                category: true,
            },
        });

        const items = await Promise.all(
            categories.map(async (category) => {
                const item = await prisma.shop.findFirst({
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
        console.error('Fetch single shop item from each category error:', error);
        return { success: false, error: 'Failed to fetch shop items from each category' };
    }
}
