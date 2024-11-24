import { addToWishlist, removeFromWishlist } from '@/actions/wishlist/wishlist.actions';
import useWishlistStore from '@/store/wishlist/wishlistStore';
import useCurrentUserStore from '@/store/auth/currentUserStore';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface UseWishlistProps {
    listingId: string;
    onWishlistUpdate?: () => void;
}

const useWishlist = ({ listingId, onWishlistUpdate }: UseWishlistProps) => {
    const router = useRouter();
    const { currentUser } = useCurrentUserStore();
    const { wishlistIds, setWishlistIds, addItem, removeItem } = useWishlistStore();
    const initialSyncDone = useRef(false);

    // Sync wishlist store with current user's wishlist only on initial load
    useEffect(() => {
        if (currentUser?.wishlistIds && !initialSyncDone.current) {
            setWishlistIds(currentUser.wishlistIds);
            initialSyncDone.current = true;
        }
    }, [currentUser?.wishlistIds, setWishlistIds]);

    const hasWishlisted = useMemo(() => {
        return wishlistIds.includes(listingId);
    }, [wishlistIds, listingId]);

    const toggleWishlist = useCallback(
        async (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();

            if (!currentUser) {
                return router.push('/auth');
            }

            try {
                if (hasWishlisted) {
                    // Update local state immediately
                    removeItem(listingId);
                    
                    // Make API call
                    const result = await removeFromWishlist(listingId);

                    if (!result.success) {
                        // Revert on failure
                        addItem(listingId);
                        toast.error(result.error || 'Failed to remove from wishlist');
                        return;
                    }

                    toast.success('Removed from wishlist');
                } else {
                    // Update local state immediately
                    addItem(listingId);
                    
                    // Make API call
                    const result = await addToWishlist(listingId);

                    if (!result.success) {
                        // Revert on failure
                        removeItem(listingId);
                        toast.error(result.error || 'Failed to add to wishlist');
                        return;
                    }

                    toast.success('Added to wishlist');
                }
            } catch (error) {
                // Revert optimistic update
                hasWishlisted ? addItem(listingId) : removeItem(listingId);
                toast.error('Something went wrong');
            }
        },
        [currentUser, hasWishlisted, listingId, router, addItem, removeItem]
    );

    return { hasWishlisted, toggleWishlist };
};

export default useWishlist;