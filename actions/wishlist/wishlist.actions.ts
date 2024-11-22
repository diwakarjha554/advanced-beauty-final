'use server';

import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '../auth/getCurrentUser';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function addToWishlist(listingId: string) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return { success: false, error: 'Not logged in' };
    }

    if (!listingId || typeof listingId !== 'string') {
        return { success: false, error: 'Invalid ID' };
    }

    try {
        const user = await prisma.user.update({
            where: { id: currentUser.id },
            data: {
                wishlistIds: {
                    push: listingId,
                },
            },
        });

        revalidatePath('/services');
        return { success: true, wishlistIds: user.wishlistIds };
    } catch (error) {
        console.error('Failed to add item to wishlist:', error);
        return { success: false, error: 'Failed to add item to wishlist' };
    }
}

export async function removeFromWishlist(listingId: string) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return { success: false, error: 'Not logged in' };
    }

    if (!listingId || typeof listingId !== 'string') {
        return { success: false, error: 'Invalid ID' };
    }

    try {
        const user = await prisma.user.update({
            where: { id: currentUser.id },
            data: {
                wishlistIds: {
                    set: currentUser?.wishlistIds?.filter((id) => id !== listingId),
                },
            },
        });

        revalidatePath('/services');
        return { success: true, wishlistIds: user.wishlistIds };
    } catch (error) {
        console.error('Failed to remove item from wishlist:', error);
        return { success: false, error: 'Failed to remove item from wishlist' };
    }
}
