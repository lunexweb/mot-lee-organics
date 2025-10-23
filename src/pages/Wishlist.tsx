import { useApp } from '@/contexts/AppContext';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Wishlist = () => {
  const { wishlist } = useApp();
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8 sm:py-16 px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center text-center">
            <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6 text-sm sm:text-base">Save your favorite products here</p>
            <Button onClick={() => navigate('/products')}>
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-4 sm:py-8 px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">My Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
