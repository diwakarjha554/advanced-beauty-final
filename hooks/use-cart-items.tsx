'use client';

import { useEffect, useState } from 'react';
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
    const { setCartIds } = useCartStore();

    const mapApiItemToCartItem = (item: ApiItem): CartItem => {
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
                quantity: item.quantity || 1, // Default to 1 if quantity is missing
            };
        }
    };

    const fetchCartItems = async () => {
        try {
            setIsLoading(true);
            const response = await getCartItems();

            if (!response.success) {
                toast.error(response.error || 'Failed to fetch cart items');
                return;
            }

            const mappedItems = response.items.map(mapApiItemToCartItem);
            setItems(mappedItems);
            setCartIds(response.cartIds || []);
        } catch (error) {
            toast.error('Failed to load cart items');
            console.error('Error fetching cart items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    return {
        items,
        isLoading,
        refreshItems: fetchCartItems,
    };
};

export default useCartItems;