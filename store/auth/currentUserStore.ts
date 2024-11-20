'use client';

import { create } from 'zustand';
import { User } from '@/actions/auth/getCurrentUser';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CurrentUserState {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
}

const useCurrentUserStore = create<CurrentUserState>()(
    persist(
        (set) => ({
            currentUser: null,
            setCurrentUser: (user) => set({ currentUser: user }),
        }),
        {
            name: 'current-user-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ currentUser: state.currentUser }),
        }
    )
);

export default useCurrentUserStore;
