export interface ServiceItem {
    id: string;
    imageSrc: string;
    category: string;
    title: string;
    description: string;
    price: number;
    discount: number;
    type: 'service';
    otherInfo?: any;
}

export interface ShopItem {
    id: string;
    imageSrc: string;
    category: string;
    title: string;
    description: string;
    price: number;
    discount: number;
    quantity: number;
    type: 'shop';
    otherInfo?: any;
}

export type WishlistItem = ServiceItem | ShopItem;
