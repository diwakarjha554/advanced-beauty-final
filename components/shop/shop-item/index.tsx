import React from 'react';
import { fetchShopItems, ShopItem } from '@/actions/admin/shop/shop-item.actions';
import Container from '@/components/ui/features/Container';
import Section from '@/components/ui/features/Section';
import { notFound } from 'next/navigation';
import ShopCard from '@/components/home/shop-section/shop-card';

const GetShopItem = async () => {
    const itemsResponse = await fetchShopItems();

    if (!itemsResponse.success || !itemsResponse.items) {
        notFound();
    }

    return (
        <Section className="py-10 md:py-16 mb-20">
            <Container className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 md:mb-12 text-center">Shop Items</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {itemsResponse.items.map((item: ShopItem) => (
                        <ShopCard
                            key={item.id}
                            src={item.imageSrc}
                            title={item.title}
                            price={item.price}
                            discount={item.discount}
                            id={item.id}
                            category={item.category}
                        />
                    ))}
                </div>
            </Container>
        </Section>
    );
};

export default GetShopItem;
