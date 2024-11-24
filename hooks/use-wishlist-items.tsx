import { useEffect, useState, useCallback, useRef } from 'react';
import { getWishlistItems } from '@/actions/wishlist/wishlist.actions';
import useWishlistStore from '@/store/wishlist/wishlistStore';
import { toast } from 'react-hot-toast';
import { ServiceItem, ShopItem } from '@/types/wishlist/index';

interface WishlistItems {
    services: ServiceItem[];
    shopItems: ShopItem[];
}

const useWishlistItems = () => {
    const [items, setItems] = useState<WishlistItems>({ services: [], shopItems: [] });
    const [isLoading, setIsLoading] = useState(true);
    const { wishlistIds } = useWishlistStore();
    const isMounted = useRef(false);

    const fetchWishlistItems = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await getWishlistItems();

            if (!response.success) {
                toast.error(response.error || 'Failed to fetch wishlist items');
                return;
            }

            setItems(response.items as WishlistItems);
        } catch (error) {
            console.error('Error fetching wishlist items:', error);
            toast.error('Failed to load wishlist items');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial fetch on mount
    useEffect(() => {
        if (!isMounted.current) {
            fetchWishlistItems();
            isMounted.current = true;
        }
    }, [fetchWishlistItems]);

    // Update items when wishlistIds change
    useEffect(() => {
        if (isMounted.current) {
            // Immediately update UI by filtering out removed items
            setItems(prevItems => ({
                services: prevItems.services.filter(service => 
                    wishlistIds.includes(service.id)
                ),
                shopItems: prevItems.shopItems.filter(item => 
                    wishlistIds.includes(item.id)
                )
            }));
        }
    }, [wishlistIds]);

    return {
        items,
        isLoading,
        refreshItems: fetchWishlistItems,
    };
};

export default useWishlistItems;