'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export type Review = {
    id: string;
    name: string;
    imageSrc: string;
    reviewText: string;
    createdAt: Date;
    updatedAt: Date;
};

export async function createReview(data: { name: string; imageSrc: string; reviewText: string }) {
    try {
        const review = await prisma.review.create({
            data: {
                name: data.name,
                imageSrc: data.imageSrc,
                reviewText: data.reviewText,
            },
        });
        revalidatePath('/home-reviews'); // Adjust the path as necessary
        return { success: true, review };
    } catch (error) {
        console.error('Create review error:', error);
        return { success: false, error: 'Failed to create review' };
    }
}

export async function updateReview(
    id: string,
    data: {
        name?: string;
        imageSrc?: string;
        reviewText?: string;
    }
) {
    try {
        const review = await prisma.review.update({
            where: { id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.imageSrc && { imageSrc: data.imageSrc }),
                ...(data.reviewText && { reviewText: data.reviewText }),
            },
        });
        revalidatePath('/home-reviews'); // Adjust the path as necessary
        return { success: true, review };
    } catch (error) {
        console.error('Update review error:', error);
        return { success: false, error: 'Failed to update review' };
    }
}

export async function deleteReview(id: string) {
    try {
        await prisma.review.delete({
            where: { id },
        });
        revalidatePath('/home-reviews'); // Adjust the path as necessary
        return { success: true };
    } catch (error) {
        console.error('Delete review error:', error);
        return { success: false, error: 'Failed to delete review' };
    }
}

export async function fetchReviews(): Promise<{
    success: boolean;
    reviews?: Review[];
    error?: string;
}> {
    try {
        const reviews = await prisma.review.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, reviews };
    } catch (error) {
        console.error('Fetch reviews error:', error);
        return { success: false, error: 'Failed to fetch reviews' };
    }
}
