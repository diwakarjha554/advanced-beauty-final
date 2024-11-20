'use client';

import { useEffect } from 'react';
import useCurrentUserStore from '@/store/auth/currentUserStore';
import { User } from '@/actions/auth/getCurrentUser';

export default function ClientInitializer({ initialUser }: { initialUser: User | null }) {
    const { setCurrentUser } = useCurrentUserStore();

    useEffect(() => {
        setCurrentUser(initialUser);
    }, [initialUser, setCurrentUser]);

    return null;
}
