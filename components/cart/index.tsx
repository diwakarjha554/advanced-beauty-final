'use client';

import React from 'react';
import Section from '../ui/features/Section';
import Container from '../ui/features/Container';
import useCurrentUserStore from '@/store/auth/currentUserStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle, Loader2, ShoppingCart, Package, Wrench, Heart, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import useCartItems from '@/hooks/use-cart-items';
import Image from 'next/image';
import { formatPrice } from '@/lib/formatPrice';
import MainTitle from '../ui/title/main-title';
import { Badge } from '../ui/badge';

interface CartItemActionsProps {
    item: {
        id: string;
        type: string;
        quantity?: number;
    };
    onSave: (itemId: string) => void;
    onRemove: (itemId: string) => void;
    onQuantityChange: (itemId: string, newQuantity: number) => void;
}

const CartItemActions: React.FC<CartItemActionsProps> = ({ item, onSave, onRemove, onQuantityChange }) => {
    return (
        <div className="mt-4 flex items-center justify-between">
            {item.type === 'shop' && (
                <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Quantity:</span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onQuantityChange(item.id, (item.quantity || 1) - 1)}
                            disabled={(item.quantity || 1) <= 1}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity || 1}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onQuantityChange(item.id, (item.quantity || 1) + 1)}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
            <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => onSave(item.id)}>
                    <Heart className="h-4 w-4" />
                    Save
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => onRemove(item.id)}
                >
                    <Trash2 className="h-4 w-4" />
                    Remove
                </Button>
            </div>
        </div>
    );
};

interface CartItemProps {
    item: {
        id: string;
        type: string;
        quantity?: number;
        imageSrc: string;
        title: string;
        price: number;
        discount: number;
        category: string;
    };
    onSave: (itemId: string) => void;
    onRemove: (itemId: string) => void;
    onQuantityChange: (itemId: string, newQuantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onSave, onRemove, onQuantityChange }) => (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex gap-6">
            <div className="relative h-32 w-32 rounded-lg overflow-hidden group">
                <Image
                    fill
                    src={item.imageSrc}
                    alt={item.title}
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
            </div>
            <div className="flex-1 flex flex-col">
                <div className="flex justify-between">
                    <div>
                        <h3 className="font-semibold text-xl capitalize transition-colors">{item.title}</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge
                                variant={item.type === 'service' ? 'secondary' : 'outline'}
                                className="flex items-center gap-1.5"
                            >
                                {item.type === 'service' ? (
                                    <Wrench className="h-3 w-3" />
                                ) : (
                                    <Package className="h-3 w-3" />
                                )}
                                <span className="capitalize font-medium">{item.type}</span>
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1.5">
                                <span className="capitalize font-medium">{item.category}</span>
                            </Badge>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-semibold text-lg">
                            {formatPrice(item.price - (item.price * item.discount) / 100)}
                        </div>
                        {item.discount > 0 && (
                            <div className="text-sm">
                                <span className="text-muted-foreground line-through">{formatPrice(item.price)}</span>
                                <span className="text-green-600 ml-2">-{item.discount}%</span>
                            </div>
                        )}
                    </div>
                </div>
                <CartItemActions item={item} onSave={onSave} onRemove={onRemove} onQuantityChange={onQuantityChange} />
            </div>
        </div>
    </Card>
);

interface OrderSummaryProps {
    subtotal: number;
    totalDiscount: number;
    shippingFee: number;
    total: number;
    onRefresh: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, totalDiscount, shippingFee, total, onRefresh }) => (
    <Card className="sticky top-4">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Summary
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(totalDiscount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <div className="flex items-center gap-1">
                        {shippingFee === 0 ? (
                            <>
                                <span className="text-green-600">Free</span>
                                <Badge variant="secondary" className="text-xs">
                                    Orders over {formatPrice(1000)}
                                </Badge>
                            </>
                        ) : (
                            formatPrice(shippingFee)
                        )}
                    </div>
                </div>
            </div>
            <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                </div>
            </div>
            <Button className="w-full bg-[#D9C1A3] hover:bg-[#c4ac8e] text-neutral-950 mt-6" size="lg">
                Place Order
            </Button>
            <div className="flex gap-2">
                <Link href="/" className="flex-1">
                    <Button variant="outline" className="w-full gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Continue Shopping
                    </Button>
                </Link>
            </div>
            <div className="border-t pt-4 font-semibold text-green-700">
                You will save ₹{totalDiscount} on this order
            </div>
        </CardContent>
    </Card>
);

const Cart = () => {
    const { currentUser } = useCurrentUserStore();
    const { items, isLoading, refreshItems } = useCartItems();

    const calculateTotals = () => {
        const subtotal = items.reduce((sum, item) => {
            const quantity = 'quantity' in item ? item.quantity : 1;
            return sum + item.price * quantity;
        }, 0);
        const totalDiscount = items.reduce((sum, item) => {
            const quantity = 'quantity' in item ? item.quantity : 1;
            return sum + (item.price * quantity * item.discount) / 100;
        }, 0);
        const shippingFee = subtotal > 1000 ? 0 : 50;
        const total = subtotal - totalDiscount + shippingFee;

        return { subtotal, totalDiscount, shippingFee, total };
    };

    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        // Implementation would go here
        console.log('Quantity changed:', itemId, newQuantity);
    };

    const handleRemoveItem = (itemId: string) => {
        // Implementation would go here
        console.log('Remove item:', itemId);
    };

    const handleSaveToWishlist = (itemId: string) => {
        // Implementation would go here
        console.log('Save to wishlist:', itemId);
    };

    if (!currentUser) {
        return (
            <Section className="py-10 md:py-20 min-h-[700px]">
                <Container className="w-full">
                    <Card className="w-full max-w-md mx-auto">
                        <CardHeader className="text-center">
                            <CardTitle className="flex items-center justify-center gap-2">
                                <AlertCircle className="h-6 w-6 text-yellow-500" />
                                <span>Login Required</span>
                            </CardTitle>
                            <CardDescription>Please log in to view and manage your cart</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Link href="/auth">
                                <Button className="bg-[#D9C1A3] hover:bg-[#c4ac8e] text-neutral-950">
                                    Login to Account
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </Container>
            </Section>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-[#D9C1A3]" />
                <p className="text-gray-500 font-medium">Loading your cart...</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <Section className="py-10 md:py-20 min-h-[700px]">
                <Container>
                    <Card className="w-full max-w-lg mx-auto">
                        <CardHeader className="text-center">
                            <CardTitle className="flex items-center justify-center gap-2">
                                <ShoppingCart className="h-6 w-6 text-gray-400" />
                                <span>Your Cart is Empty</span>
                            </CardTitle>
                            <CardDescription>Add items to your cart to begin shopping</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Link href="/">
                                <Button className="bg-[#D9C1A3] hover:bg-[#c4ac8e] text-neutral-950">
                                    Continue Shopping
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </Container>
            </Section>
        );
    }

    const totals = calculateTotals();

    return (
        <Section className="py-10 md:py-20">
            <Container className="w-full">
                <div className="flex items-center justify-between">
                    <MainTitle heading="Cart" subheading="Your Shopping Cart is Almost Ready" />
                    <Link
                        href="/order"
                        className="w-fit bg-[#D9C1A3] hover:bg-[#c4ac8e] text-neutral-950 mt-6 font-medium py-2 px-5 rounded transition-colors"
                    >
                        Your Orders
                    </Link>
                </div>
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-4">
                        {items.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onSave={handleSaveToWishlist}
                                onRemove={handleRemoveItem}
                                onQuantityChange={handleQuantityChange}
                            />
                        ))}
                    </div>
                    <div className="lg:col-span-4">
                        <OrderSummary {...totals} onRefresh={refreshItems} />
                    </div>
                </div>
            </Container>
        </Section>
    );
};

export default Cart;
