'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, ShoppingCart } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, isBefore, isToday, addHours, set } from 'date-fns';
import Container from '@/components/ui/features/Container';
import Section from '@/components/ui/features/Section';
import Image from 'next/image';
import HeartButton from '@/components/wishlist/heart-btn';
import { ServiceItem } from '@/actions/admin/service/service-item.actions';
import CartButton from '@/components/cart/cart-btn';

interface ServiceItemDetailClientProps {
    service: ServiceItem;
}

const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isBefore(date, today)) {
        return true;
    }

    if (isToday(date)) {
        const currentTime = new Date();
        const cutoffTime = new Date();
        cutoffTime.setHours(currentTime.getHours() + 6, 0, 0, 0);
        const lastSlot = new Date();
        lastSlot.setHours(17, 0, 0, 0);

        if (cutoffTime > lastSlot) {
            return true;
        }
    }

    return false;
};

const getAvailableTimeSlots = (selectedDate: Date | undefined) => {
    const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

    if (!selectedDate || !isToday(selectedDate)) {
        return timeSlots;
    }

    const currentTime = new Date();
    const cutoffTime = addHours(currentTime, 6);

    return timeSlots.filter((slot) => {
        const [hour, minute, period] = slot.match(/(\d+):(\d+) (AM|PM)/)?.slice(1) || [];
        const slotHour = parseInt(hour) + (period === 'PM' && hour !== '12' ? 12 : 0);
        const slotDate = set(new Date(), {
            hours: slotHour,
            minutes: parseInt(minute),
            seconds: 0,
            milliseconds: 0,
        });

        return isBefore(cutoffTime, slotDate);
    });
};

export default function ServiceItemDetailClient({ service }: ServiceItemDetailClientProps) {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedTime, setSelectedTime] = useState<string>();
    const [calendarOpen, setCalendarOpen] = useState(false);

    const hasDiscount = service.discount > 0;
    const discountAmount = hasDiscount ? Math.round((service.price * service.discount) / 100) : 0;
    const discountedPrice = hasDiscount ? Math.round(service.price - discountAmount) : service.price;

    const availableTimeSlots = getAvailableTimeSlots(selectedDate);

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        setSelectedTime(undefined);
        setCalendarOpen(false); // Close the calendar popover after date selection
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add your booking logic here
    };

    return (
        <Section className="py-10 md:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
            <Container className="w-full mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <Card className="overflow-hidden border-none shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        <div className="relative p-6">
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                                <Image
                                    src={service.imageSrc}
                                    alt={service.title}
                                    width={1000}
                                    height={1000}
                                    className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 z-10">
                                    <HeartButton listingId={service.id} />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 lg:p-8">
                            <CardHeader className="px-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="secondary" className="text-primary">
                                        {service.category}
                                    </Badge>
                                    <Badge variant="outline">{service.type}</Badge>
                                </div>
                                <CardTitle className="text-3xl md:text-4xl font-bold text-gray-800 capitalize">
                                    {service.title}
                                </CardTitle>
                                <CardDescription className="text-gray-600 mt-4 text-base leading-relaxed">
                                    {service.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="px-0">
                                <Card className="bg-gray-50 border-none shadow-sm mb-8">
                                    <CardContent className="p-6">
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-4xl font-bold text-primary">
                                                ₹{discountedPrice.toLocaleString()}
                                            </span>
                                            {hasDiscount && (
                                                <>
                                                    <span className="text-gray-400 line-through text-xl">
                                                        ₹{service.price.toLocaleString()}
                                                    </span>
                                                    <Badge variant="destructive" className="ml-2">
                                                        {service.discount}% OFF
                                                    </Badge>
                                                </>
                                            )}
                                        </div>
                                        {hasDiscount && (
                                            <div className="mt-4 space-y-2">
                                                <Badge variant="secondary" className="text-sm">
                                                    Save ₹{discountAmount.toLocaleString()}
                                                </Badge>
                                                <p className="text-sm text-gray-600">
                                                    Limited time offer - Book now to avail the discount
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Preferred Date</label>
                                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {selectedDate ? (
                                                        format(selectedDate, 'PPP')
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={selectedDate}
                                                    onSelect={handleDateSelect}
                                                    disabled={isDateDisabled}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {selectedDate && isToday(selectedDate) && (
                                            <p className="text-sm text-amber-600">
                                                * Only showing times available with 6-hour notice
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Preferred Time</label>
                                        <Select
                                            value={selectedTime}
                                            onValueChange={setSelectedTime}
                                            disabled={!selectedDate}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableTimeSlots.length === 0 ? (
                                                    <SelectItem value="no-slots" disabled>
                                                        No available slots
                                                    </SelectItem>
                                                ) : (
                                                    availableTimeSlots.map((time) => (
                                                        <SelectItem key={time} value={time}>
                                                            {time}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {selectedDate && availableTimeSlots.length === 0 && (
                                            <p className="text-sm text-red-500">
                                                No available time slots for this date
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <CartButton
                                            listingId={service.id}
                                            selectedDate={selectedDate}
                                            selectedTime={selectedTime}
                                        />
                                        <Button
                                            type="submit"
                                            className="flex-1"
                                            disabled={!selectedDate || !selectedTime}
                                        >
                                            Book Now
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </div>
                    </div>
                </Card>
            </Container>
        </Section>
    );
}