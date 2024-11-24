import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UseCart from '@/hooks/use-cart';

interface CartButtonProps {
    listingId: string;
    selectedDate?: Date;
    selectedTime?: string;
}

const CartButton: React.FC<CartButtonProps> = ({ listingId, selectedDate, selectedTime }) => {
    const { hasCarted, toggleCart } = UseCart({ listingId });
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // Cast the event type to match what toggleCart expects
        toggleCart(e as unknown as React.MouseEvent<HTMLDivElement>);
        
    };

    return (
        <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleClick}
        >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {hasCarted ? 'Remove from Cart' : 'Add to Cart'}
        </Button>
    );
};

export default CartButton;
