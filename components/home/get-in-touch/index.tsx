import Container from '@/components/ui/features/Container';
import Section from '@/components/ui/features/Section';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { FaArrowRight } from 'react-icons/fa6';

const HomeGetInTouch = () => {
    return (
        <Section
            className="py-16 sm:py-20 bg-fixed bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/section-images/getintouchSection/getintouch_parallax.jpg')" }}
        >
            <Container className="w-full relative flex items-center">
                <Image
                    src={'/section-images/getintouchSection/getInTouch.jpg'}
                    alt="Get in touch"
                    width={1000000}
                    height={1000000}
                    className="w-[800px] h-[700px] ml-16 hidden lg:block"
                />
                <div className="bg-white w-full lg:w-[800px] sm:h-[500px] p-8 flex flex-col justify-center items-center gap-5 lg:absolute lg:right-16 lg:top-1/2 lg:-translate-y-1/2">
                    <span className="font-quentin text-2xl sm:text-3xl text-[#D9C1A3] font-medium">Get in touch</span>
                    <div className="uppercase flex flex-col items-center text-3xl sm:text-4xl lg:text-5xl gap-3 text-center">
                        <span>Book Time</span>
                        <span>To Get Manicure</span>
                    </div>
                    <div className="px-4 sm:px-10 lg:px-20">
                        <p className="text-center text-sm sm:text-base">
                            Sed quam urna, facilisis eleifend ipsum vel, imperdiet tristique ante. Phasellus pretium
                            dapibus gravida. Sed eu ligula hendrerit, venenatis eros in, vulputate diam.
                        </p>
                    </div>
                    <Link
                        href={'/'}
                        className="border px-4 py-2 sm:px-5 sm:py-3 flex items-center gap-2 text-xs sm:text-sm lg:text-base"
                    >
                        Read More
                        <FaArrowRight />
                    </Link>
                </div>
            </Container>
        </Section>
    );
};

export default HomeGetInTouch;
