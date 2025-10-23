import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Product } from '@/contexts/AppContext';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useApp();
  const isInWishlist = wishlist.some(item => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist`);
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="block">
      <Card className="group overflow-hidden hover-lift border-border/50 cursor-pointer">
        <div className="aspect-square overflow-hidden bg-secondary/20">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? 'fill-accent text-accent'
                    : 'text-muted-foreground/30'
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-foreground">R{product.price}</p>
            <p className="text-xs text-muted-foreground">{product.stock} in stock</p>
          </div>
          
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleToggleWishlist}
              className={isInWishlist ? 'text-accent' : ''}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
            </Button>
            <Button size="icon" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
