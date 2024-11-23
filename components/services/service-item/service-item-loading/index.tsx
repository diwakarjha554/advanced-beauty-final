import { Card } from '@/components/ui/card';
import Container from '@/components/ui/features/Container';
import Section from '@/components/ui/features/Section';
import { Skeleton } from '@/components/ui/skeleton';

export default function ServiceItemDetailLoading() {
    return (
        <Section className="py-12 md:py-16 lg:py-20">
            <Container className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-6">
                        <Skeleton className="aspect-[4/3] rounded-xl" />
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-3/4" />
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-12 w-1/3" />
                            <div className="space-y-4 mt-8">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        </div>
                    </div>
                </Card>
            </Container>
        </Section>
    );
}
