'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export type ShopCategory = {
    id: string;
    title: string;
    imageSrc: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
};

export async function createShopCategory(data: { title: string; imageSrc: string; description: string }) {
    try {
        const category = await prisma.shopCategory.create({
            data: {
                title: data.title,
                imageSrc: data.imageSrc,
                description: data.description,
            },
        });
        revalidatePath('/shop-categories');
        return { success: true, category };
    } catch (error) {
        console.error('Create category error:', error);
        return { success: false, error: 'Failed to create category' };
    }
}

export async function updateShopCategory(
    id: string,
    data: {
        title?: string;
        imageSrc?: string;
        description?: string;
    }
) {
    try {
        const category = await prisma.shopCategory.update({
            where: { id },
            data: {
                ...(data.title && { title: data.title }),
                ...(data.imageSrc && { imageSrc: data.imageSrc }),
                ...(data.description && { description: data.description }),
            },
        });
        revalidatePath('/shop-categories');
        return { success: true, category };
    } catch (error) {
        console.error('Update category error:', error);
        return { success: false, error: 'Failed to update category' };
    }
}

export async function deleteShopCategory(id: string) {
    try {
        await prisma.shopCategory.delete({
            where: { id },
        });
        revalidatePath('/shop-categories');
        return { success: true };
    } catch (error) {
        console.error('Delete category error:', error);
        return { success: false, error: 'Failed to delete category' };
    }
}

export async function fetchShopCategories(): Promise<{
    success: boolean;
    categories?: ShopCategory[];
    error?: string;
}> {
    try {
        const categories = await prisma.shopCategory.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, categories };
    } catch (error) {
        console.error('Fetch categories error:', error);
        return { success: false, error: 'Failed to fetch categories' };
    }
}
