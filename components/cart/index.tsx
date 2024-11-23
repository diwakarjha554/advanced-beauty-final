'use client';

import React from 'react';
import Section from '../ui/features/Section';
import Container from '../ui/features/Container';
import useCurrentUserStore from '@/store/auth/currentUserStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle, Loader2, ShoppingCart, Package, Wrench } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import useCartItems from '@/hooks/use-cart-items';
import Image from 'next/image';
import { formatPrice } from '@/lib/formatPrice';
import MainTitle from '../ui/title/main-title';

const Cart = () => {
    const { currentUser } = useCurrentUserStore();
    const { items, isLoading, refreshItems } = useCartItems();

    // Calculate totals
    const calculateTotals = () => {
        const subtotal = items.reduce((sum, item) => sum + item.price, 0);
        const totalDiscount = items.reduce((sum, item) => sum + (item.price * item.discount) / 100, 0);
        const shippingFee = subtotal > 1000 ? 0 : 50;
        const total = subtotal - totalDiscount + shippingFee;

        return { subtotal, totalDiscount, shippingFee, total };
    };

    if (!currentUser) {
        return (
            <Section className="py-10 md:py-20 mb-20 min-h-[700px]">
                <Container>
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
            <Section className="py-10 md:py-20 mb-20 min-h-[700px]">
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

    const { subtotal, totalDiscount, shippingFee, total } = calculateTotals();

    return (
        <Section className="py-10 md:py-20">
            <Container>
                <MainTitle
                    heading="Shopping Cart"
                    subheading={`${items.length} ${items.length === 1 ? 'item' : 'items'} in your cart`}
                />

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <Card key={item.id} className="p-4">
                                <div className="flex gap-4">
                                    <div className="relative h-24 w-24 rounded-md overflow-hidden">
                                        <Image fill src={item.imageSrc} alt={item.title} className="object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="font-semibold text-lg">{item.title}</h3>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    {item.type === 'service' ? (
                                                        <Wrench className="h-4 w-4" />
                                                    ) : (
                                                        <Package className="h-4 w-4" />
                                                    )}
                                                    <span className="capitalize">{item.type}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold">
                                                    {formatPrice(item.price - (item.price * item.discount) / 100)}
                                                </div>
                                                {item.discount > 0 && (
                                                    <div className="text-sm">
                                                        <span className="text-muted-foreground line-through">
                                                            {formatPrice(item.price)}
                                                        </span>
                                                        <span className="text-green-600 ml-2">-{item.discount}%</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {item.type === 'shop' && (
                                            <div className="mt-2 text-sm text-muted-foreground">
                                                Quantity: {item.quantity}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
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
                                    <span>{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                </div>
                                <Button
                                    className="w-full bg-[#D9C1A3] hover:bg-[#c4ac8e] text-neutral-950 mt-6"
                                    size="lg"
                                >
                                    Place Order
                                </Button>
                                <Button variant="outline" className="w-full" onClick={refreshItems}>
                                    Refresh Cart
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Container>
        </Section>
    );
};

export default Cart;
