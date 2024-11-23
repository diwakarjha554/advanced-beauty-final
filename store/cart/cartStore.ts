'use client';

import { create } from 'zustand';

interface CartStore {
    cartIds: string[];
    setCartIds: (ids: string[]) => void;
    addItem: (id: string) => void;
    removeItem: (id: string) => void;
}

const useCartStore = create<CartStore>((set) => ({
    cartIds: [],
    setCartIds: (ids) => set({ cartIds: ids }),
    addItem: (id) =>
        set((state) => ({
            cartIds: [...state.cartIds, id],
        })),
    removeItem: (id) =>
        set((state) => ({
            cartIds: state.cartIds.filter((itemId) => itemId !== id),
        })),
}));

export default useCartStore;
