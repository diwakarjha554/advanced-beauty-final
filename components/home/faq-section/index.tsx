import Container from '@/components/ui/features/Container';
import Section from '@/components/ui/features/Section';
import React from 'react';
import FaqContent from './faq-content';
import MainTitle from '@/components/ui/title/main-title';

const HomeFAQSection = () => {
    return (
        <Section className="py-20">
            <Container className="w-full flex flex-col gap-10">
                <MainTitle heading="FAQ" subheading="Most frequently asked questions" isSmallS />
                <FaqContent />
            </Container>
        </Section>
    );
};

export default HomeFAQSection;
