'use client';

import React from 'react';
import { Loader2, Heart, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Section from '../ui/features/Section';
import Container from '../ui/features/Container';
import useCurrentUserStore from '@/store/auth/currentUserStore';
import useWishlistItems from '@/hooks/use-wishlist-items';
import ServiceCard from '../home/service-section/service-card';
import MainTitle from '../ui/title/main-title';

const Wishlist = () => {
    const { currentUser } = useCurrentUserStore();
    const { items, isLoading, refreshItems } = useWishlistItems();

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
                            <CardDescription>Please log in to view and manage your wishlist</CardDescription>
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
                <p className="text-gray-500 font-medium">Loading your wishlist...</p>
            </div>
        );
    }

    const totalServices = items.services.length;
    const totalShopItems = items.shopItems.length;
    const totalItems = totalServices + totalShopItems;

    if (totalItems === 0) {
        return (
            <Section className="py-10 md:py-20 mb-20 min-h-[700px]">
                <Container>
                    <Card className="w-full max-w-lg mx-auto">
                        <CardHeader className="text-center">
                            <CardTitle className="flex items-center justify-center gap-2">
                                <Heart className="h-6 w-6 text-gray-400" />
                                <span>Your Wishlist is Empty</span>
                            </CardTitle>
                            <CardDescription>
                                Start adding items to your wishlist to keep track of things you love
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Link href="/">
                                <Button className="bg-[#D9C1A3] hover:bg-[#c4ac8e] text-neutral-950">
                                    Browse Items
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </Container>
            </Section>
        );
    }

    return (
        <Section className="py-10 md:py-20 mb-20">
            <Container className="w-full">
                <div className="space-y-6 min-h-[500px]">
                    <Tabs defaultValue="services" className="w-full">
                        <div className="flex flex-col md:flex-row md:justify-between gap-5 mg:gap-20">
                            <MainTitle heading='Wishlist' subheading='Discover and revisit your dream items anytime'/>
                            <div className='flex flex-wrap gap-4 max-w-[573px] w-full'>
                                <TabsList className="grid w-full max-w-md grid-cols-2">
                                    <TabsTrigger
                                        value="services"
                                        className="data-[state=active]:bg-[#D9C1A3] data-[state=active]:text-neutral-950"
                                    >
                                        Services ({totalServices})
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="shop"
                                        className="data-[state=active]:bg-[#D9C1A3] data-[state=active]:text-neutral-950"
                                    >
                                        Shop Items ({totalShopItems})
                                    </TabsTrigger>
                                </TabsList>
                                <Button onClick={refreshItems} variant="outline" className="w-fit">
                                    Refresh List
                                </Button>
                            </div>
                        </div>

                        <TabsContent value="services" className="mt-12">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {items.services.map((service) => (
                                    <div key={service.id} className="group relative">
                                        <ServiceCard
                                            id={service.id}
                                            title={service.title}
                                            price={service.price}
                                            discount={service.discount}
                                            category={service.category}
                                            src={service.imageSrc}
                                        />
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="shop" className="mt-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {items.shopItems.map((item) => (
                                    <div key={item.id} className="group relative">
                                        <ServiceCard
                                            id={item.id}
                                            title={item.title}
                                            price={item.price}
                                            discount={item.discount}
                                            category={item.category}
                                            src={item.imageSrc}
                                        />
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </Container>
        </Section>
    );
};

export default Wishlist;
