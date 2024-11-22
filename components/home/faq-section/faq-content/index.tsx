import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FaqContent = () => {
    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger className='hover:no-underline text-xl font-medium'>
                    What is a salon at home?
                </AccordionTrigger>
                <AccordionContent className='text-base text-neutral-700'>
                    Salon at Home is a beauty service provider that offers nail and spa services at your home within your own comfort. You just have to contact the advanced beauty which is the best salon at home in Noida and Delhi NCR, choose the service, like nail extensions, facial, waxing, eyelashes extensions, and makeup artist, and select your preferred time and date. Rest will be handled by the salon and the beautician and artist will be sent to your home.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger className='hover:no-underline text-xl font-medium'>
                    Is it accessible?
                </AccordionTrigger>
                <AccordionContent className='text-base text-neutral-700'>
                    Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger className='hover:no-underline text-xl font-medium'>
                    Is it accessible?
                </AccordionTrigger>
                <AccordionContent className='text-base text-neutral-700'>
                    Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
                <AccordionTrigger className='hover:no-underline text-xl font-medium'>
                    Is it accessible?
                </AccordionTrigger>
                <AccordionContent className='text-base text-neutral-700'>
                    Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default FaqContent;
