'use client';

import { useEffect, useState } from 'react';
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
    const { setWishlistIds } = useWishlistStore();

    const fetchWishlistItems = async () => {
        try {
            setIsLoading(true);
            const response = await getWishlistItems();

            if (!response.success) {
                toast.error(response.error || 'Failed to fetch wishlist items');
                return;
            }

            setItems(response.items as WishlistItems);
            setWishlistIds(response.wishlistIds || []);
        } catch (error) {
            toast.error('Failed to load wishlist items');
            console.error('Error fetching wishlist items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlistItems();
    }, []);

    return {
        items,
        isLoading,
        refreshItems: fetchWishlistItems,
    };
};

export default useWishlistItems;
