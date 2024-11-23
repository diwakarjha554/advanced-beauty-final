'use server';

import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '../auth/getCurrentUser';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function addToCart(listingId: string) {
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
                cartIds: {
                    push: listingId,
                },
            },
        });

        revalidatePath('/cart');
        return { success: true, cartIds: user.cartIds };
    } catch (error) {
        console.error('Failed to add item to cart:', error);
        return { success: false, error: 'Failed to add item to cart' };
    }
}

export async function removeFromCart(listingId: string) {
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
                cartIds: {
                    set: currentUser?.cartIds?.filter((id) => id !== listingId),
                },
            },
        });

        revalidatePath('/cart');
        return { success: true, cartIds: user.cartIds };
    } catch (error) {
        console.error('Failed to remove item from cart:', error);
        return { success: false, error: 'Failed to remove item from cart' };
    }
}

export async function getCartItems() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return {
                success: false,
                error: 'Not logged in',
                items: [],
            };
        }
        // Fetch all service items from wishlist
        const serviceItems = await prisma.service.findMany({
            where: {
                id: {
                    in: currentUser.cartIds,
                },
            },
        });
        // Fetch all shop items from cart
        const shopItems = await prisma.shop.findMany({
            where: {
                id: {
                    in: currentUser.cartIds,
                },
            },
        });
        // Combine service and shop items into a single array
        const combinedItems = [...serviceItems, ...shopItems];

        return {
            success: true,
            items: combinedItems,
            cartIds: currentUser.cartIds,
        };
    } catch (error) {
        console.error('Failed to fetch cart items:', error);
        return {
            success: false,
            error: 'Failed to fetch cart items',
            items: [],
        };
    }
}
