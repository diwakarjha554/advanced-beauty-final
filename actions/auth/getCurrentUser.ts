import { auth } from '@/auth';
import { Session } from 'next-auth';
import { prisma } from '@/lib/prisma';

export interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isAdmin?: boolean;
    createdAt?: string;
    updatedAt?: string;
    emailVerified?: string | null;
    wishlistIds?: string[];
}

export async function getSession(): Promise<Session | null> {
    try {
        const session = await auth();
        return session;
    } catch (error) {
        console.error('Error getting session:', error);
        return null;
    }
}

export async function getCurrentUser(): Promise<User | null> {
    try {
        const session = await getSession();
        if(!session?.user?.email) {
            return null;
        }
        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string
            }
        });
        if(!currentUser) {
            return null;
        }
        return {
            ...currentUser,
            createdAt: currentUser.createdAt.toISOString(),
            updatedAt: currentUser.updatedAt.toISOString(),
            emailVerified: currentUser.emailVerified?.toISOString() || null,
            isAdmin: currentUser.isAdmin
        };
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}