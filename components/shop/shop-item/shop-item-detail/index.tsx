'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MinusIcon, PlusIcon } from 'lucide-react';
import Container from '@/components/ui/features/Container';
import Section from '@/components/ui/features/Section';
import Image from 'next/image';
import HeartButton from '@/components/wishlist/heart-btn';
import { ShopItem } from '@/actions/admin/shop/shop-item.actions';
import CartButton from '@/components/cart/cart-btn';

interface ShopItemDetailClientProps {
    item: ShopItem;
}

export default function ShopItemDetailClient({ item }: ShopItemDetailClientProps) {
    const [quantity, setQuantity] = useState(1);

    const hasDiscount = item.discount > 0;
    const discountAmount = hasDiscount ? Math.round((item.price * item.discount) / 100) : 0;
    const discountedPrice = hasDiscount ? Math.round(item.price - discountAmount) : item.price;

    const incrementQuantity = () => {
        if (quantity < item.quantity) {
            setQuantity((prev) => prev + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    return (
        <Section className="py-10 md:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
            <Container className="w-full mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <Card className="overflow-hidden border-none shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        <div className="relative p-6">
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                                <Image
                                    src={item.imageSrc}
                                    alt={item.title}
                                    width={1000}
                                    height={1000}
                                    className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 z-10">
                                    <HeartButton listingId={item.id} />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 lg:p-8">
                            <CardHeader className="px-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="secondary" className="text-primary">
                                        {item.category}
                                    </Badge>
                                    <Badge variant="outline">{item.quantity} in stock</Badge>
                                </div>
                                <CardTitle className="text-3xl md:text-4xl font-bold text-gray-800 capitalize">
                                    {item.title}
                                </CardTitle>
                                <CardDescription className="text-gray-600 mt-4 text-base leading-relaxed">
                                    {item.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="px-0">
                                <Card className="bg-gray-50 border-none shadow-sm mb-8">
                                    <CardContent className="p-6">
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-4xl font-bold text-primary">
                                                ₹{(discountedPrice * quantity).toLocaleString()}
                                            </span>
                                            {hasDiscount && (
                                                <>
                                                    <span className="text-gray-400 line-through text-xl">
                                                        ₹{(item.price * quantity).toLocaleString()}
                                                    </span>
                                                    <Badge variant="destructive" className="ml-2">
                                                        {item.discount}% OFF
                                                    </Badge>
                                                </>
                                            )}
                                        </div>
                                        {hasDiscount && (
                                            <div className="mt-4 space-y-2">
                                                <Badge variant="secondary" className="text-sm">
                                                    Save ₹{(discountAmount * quantity).toLocaleString()}
                                                </Badge>
                                                <p className="text-sm text-gray-600">
                                                    Limited time offer - Buy now to avail the discount
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={decrementQuantity}
                                            disabled={quantity <= 1}
                                        >
                                            <MinusIcon className="h-4 w-4" />
                                        </Button>
                                        <span className="text-xl font-medium">{quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={incrementQuantity}
                                            disabled={quantity >= item.quantity}
                                        >
                                            <PlusIcon className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="flex gap-4">
                                        <CartButton listingId={item.id} />
                                        <Button className="flex-1" disabled={item.quantity === 0}>
                                            Buy Now
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    </div>
                </Card>
            </Container>
        </Section>
    );
}
