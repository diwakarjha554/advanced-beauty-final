'use client';

import useCurrentUserStore from '@/store/auth/currentUserStore';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cart/cartStore';
import { addToCart, removeFromCart } from '@/actions/cart/cart.actions';

interface UseCartProps {
    listingId: string;
    onCartUpdate?: () => void;
}

const UseCart = ({ listingId, onCartUpdate }: UseCartProps) => {
    const router = useRouter();
    const { currentUser } = useCurrentUserStore();
    const { cartIds, setCartIds, addItem, removeItem } = useCartStore();
    const initialSyncDone = useRef(false);

    // Sync cart store with current user's cart only on initial load or when user changes
    useEffect(() => {
        if (currentUser?.cartIds && !initialSyncDone.current) {
            setCartIds(currentUser.cartIds);
            initialSyncDone.current = true;
        }
    }, [currentUser?.cartIds, setCartIds]);

    const hasCarted = useMemo(() => {
        return cartIds.includes(listingId);
    }, [cartIds, listingId]);

    const toggleCart = useCallback(
        async (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            if (!currentUser) {
                return router.push('/auth');
            }
            try {
                if (hasCarted) {
                    // Optimistic update
                    removeItem(listingId);
                    const result = await removeFromCart(listingId);
                    if (!result.success) {
                        // Revert on failure
                        addItem(listingId);
                        toast.error(result.error || 'Failed to remove from cart');
                        return;
                    }
                    toast.success('Removed from cart');
                } else {
                    // Optimistic update
                    addItem(listingId);
                    const result = await addToCart(listingId);
                    if (!result.success) {
                        // Revert on failure
                        removeItem(listingId);
                        toast.error(result.error || 'Failed to add to cart');
                        return;
                    }
                    toast.success('Added to cart');
                }
                // Trigger callback to refresh cart items
                onCartUpdate?.();
            } catch (error) {
                // Revert optimistic update
                hasCarted ? addItem(listingId) : removeItem(listingId);
                toast.error('Something went wrong');
            }
        },
        [currentUser, hasCarted, listingId, router, addItem, removeItem, onCartUpdate]
    );

    return { hasCarted, toggleCart };
};

export default UseCart;
