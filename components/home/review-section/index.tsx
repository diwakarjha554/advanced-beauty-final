import React from 'react';
import ReviewsCard from '@/components/home/review-section/reviews-card';
import CustomCarousel from '@/components/ui/custom-carousel';
import Container from '@/components/ui/features/Container';
import Section from '@/components/ui/features/Section';
import { fetchReviews } from '@/actions/admin/review/review.actions';

async function HomeReviewSection() {
    const reviewsData = await fetchReviews();
    const isLoading = !reviewsData;
    const carouselItems = reviewsData?.reviews?.map((card) => <ReviewsCard key={card.name} {...card} isLoading={isLoading} />) ?? [];

    return (
        <Section className="py-20 bg-[#FBF1EA]">
            <Container className="w-full">
                <div className="w-full flex flex-col items-center gap-2 mb-16">
                    <h2 className="font-quentin text-3xl font-semibold text-[#D9C1A3]">testimonials</h2>
                    <h3 className="text-4xl font-semibold">what our client says</h3>
                </div>
                <div className="w-full">
                    <CustomCarousel
                        items={carouselItems}
                        slidesPerView={1}
                        spaceBetween={30}
                        loop={true}
                        className="custom-swiper"
                        autoplay={{ delay: 1700, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        speed={1500}
                        navigationOn={true}
                    />
                </div>
            </Container>
        </Section>
    );
};

export default React.memo(HomeReviewSection);
