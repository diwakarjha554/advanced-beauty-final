'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { getCartItems } from '@/actions/cart/cart.actions';
import useCartStore from '@/store/cart/cartStore';
import { toast } from 'react-hot-toast';
import { CartItem } from '@/types/cart';

interface ApiItem {
    id: string;
    imageSrc: string;
    category: string;
    title: string;
    description: string;
    price: number;
    discount: number;
    otherInfo: any;
    type: string;
    quantity?: number;
    createdAt: Date;
    updatedAt: Date;
}

const useCartItems = () => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { setCartIds, cartIds } = useCartStore();
    const prevCartIdsRef = useRef<string[]>([]);
    const isMounted = useRef(false);

    const mapApiItemToCartItem = useCallback((item: ApiItem): CartItem => {
        const baseItem = {
            id: item.id,
            imageSrc: item.imageSrc,
            category: item.category,
            title: item.title,
            description: item.description,
            price: item.price,
            discount: item.discount,
            otherInfo: item.otherInfo,
        };

        if (item.type === 'service') {
            return {
                ...baseItem,
                type: 'service' as const,
            };
        } else {
            return {
                ...baseItem,
                type: 'shop' as const,
                quantity: item.quantity || 1,
            };
        }
    }, []);

    const fetchCartItems = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await getCartItems();

            if (!response.success) {
                toast.error(response.error || 'Failed to fetch cart items');
                return;
            }

            const mappedItems = response.items.map(mapApiItemToCartItem);
            setItems(mappedItems);

            // Only update cartIds if they're different
            if (JSON.stringify(response.cartIds) !== JSON.stringify(cartIds)) {
                setCartIds(response.cartIds || []);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
            toast.error('Failed to load cart items');
        } finally {
            setIsLoading(false);
        }
    }, [mapApiItemToCartItem, setCartIds, cartIds]);

    // Initial fetch on mount
    useEffect(() => {
        if (!isMounted.current) {
            fetchCartItems();
            isMounted.current = true;
        }
    }, [fetchCartItems]);

    // Fetch when cartIds change (but only if it's a real change)
    useEffect(() => {
        if (isMounted.current && JSON.stringify(prevCartIdsRef.current) !== JSON.stringify(cartIds)) {
            prevCartIdsRef.current = cartIds;
            fetchCartItems();
        }
    }, [cartIds, fetchCartItems]);

    return {
        items,
        isLoading,
        refreshItems: fetchCartItems,
    };
};

export default useCartItems;
