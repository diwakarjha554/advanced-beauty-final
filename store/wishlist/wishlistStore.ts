'use client';

import { create } from 'zustand';

interface WishlistStore {
    wishlistIds: string[];
    setWishlistIds: (ids: string[]) => void;
    addItem: (id: string) => void;
    removeItem: (id: string) => void;
}

const useWishlistStore = create<WishlistStore>((set) => ({
    wishlistIds: [],
    setWishlistIds: (ids) => set({ wishlistIds: ids }),
    addItem: (id) =>
        set((state) => ({
            wishlistIds: [...state.wishlistIds, id],
        })),
    removeItem: (id) =>
        set((state) => ({
            wishlistIds: state.wishlistIds.filter((itemId) => itemId !== id),
        })),
}));

export default useWishlistStore;
