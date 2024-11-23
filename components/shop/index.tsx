'use client';

import React, { useEffect, useState } from 'react';
import Section from '../ui/features/Section';
import Container from '../ui/features/Container';
import MainTitle from '../ui/title/main-title';
import ImageCard from '../ui/cards/ImageCard';
import { fetchShopCategories, ShopCategory } from '@/actions/admin/shop/shop-category.actions';

const Shop = () => {
    const [categories, setCategories] = useState<ShopCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const formatUrlString = (title: string) => {
        return title
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await fetchShopCategories();
                if (result.success && result.categories) {
                    const reversedCategories = [...result.categories];
                    setCategories(reversedCategories);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <Section className="py-8 sm:py-12 md:py-16 lg:py-20 mb-20">
            <Container className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
                <div className="w-full flex justify-center items-center">
                    <MainTitle heading="All Shop Categories" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {isLoading
                        ? Array.from({ length: 6 }).map((_, index) => (
                              <div className="flex justify-center" key={index}>
                                  <ImageCard src="" alt="" isLoading={true} />
                              </div>
                          ))
                        : categories.map((category) => (
                              <div className="flex justify-center" key={category.id}>
                                  <ImageCard
                                      src={category.imageSrc}
                                      alt={category.title}
                                      title={category.title}
                                      href={`/shop/${formatUrlString(category.title)}`}
                                      isLoading={false}
                                  />
                              </div>
                          ))}
                </div>
            </Container>
        </Section>
    );
};

export default Shop;
