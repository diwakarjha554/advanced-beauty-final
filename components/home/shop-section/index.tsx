import Container from '@/components/ui/features/Container';
import Section from '@/components/ui/features/Section';
import React from 'react';
import { HomeServices } from '@/data/homeServices';
import { FiArrowRight } from 'react-icons/fi';
import ShopCard from '@/components/home/shop-section/shop-card';
import Link from 'next/link';
import CustomCarousel from '@/components/ui/custom-carousel';
import MainTitle from '@/components/ui/title/main-title';
import { fetchSingleShopItemFromEachCategory } from '@/actions/admin/shop/shop-item.actions';

const HomeShopSection = async () => {
    const result = await fetchSingleShopItemFromEachCategory();
    const carouselItems =
        result?.items?.map((card, index) => (
            <ShopCard
                key={index}
                src={card.imageSrc}
                title={card.title}
                price={card.price}
                discount={card.discount}
                category={card.category}
                id={card.id}
            />
        )) || [];

    return (
        <Section className="py-20 bg-[#FBF1EA]">
            <Container className="w-full flex flex-col gap-10 py-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <MainTitle heading="Our Products" subheading="Buy your favourite items" />
                    <Link
                        href={'/shop'}
                        className="bg-[#D9C1A3] rounded-[2px] p-2 text-neutral-950 font-medium text-sm flex items-center gap-2"
                    >
                        View All <FiArrowRight />
                    </Link>
                </div>

                <CustomCarousel
                    items={carouselItems}
                    slidesPerView={3}
                    spaceBetween={20}
                    loop={true}
                    navigationOn={true}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        500: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                    }}
                />
            </Container>
        </Section>
    );
};

export default HomeShopSection;
