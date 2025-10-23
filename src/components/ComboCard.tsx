import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/contexts/AppContext';
import { useApp } from '@/contexts/AppContext';

interface ComboCardProps {
  product: Product;
}

export const ComboCard = ({ product }: ComboCardProps) => {
  const { addToCart, addToWishlist, wishlist } = useApp();
  const isInWishlist = wishlist.some(item => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      // Remove from wishlist logic would go here
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
              COMBO
            </Badge>
            {product.stock < 10 && (
              <Badge variant="destructive" className="text-xs">
                Low Stock
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 h-8 w-8 rounded-full bg-background/80 hover:bg-background"
            onClick={handleToggleWishlist}
          >
            <Heart
              className={`h-4 w-4 ${
                isInWishlist ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
              }`}
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviews} reviews)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary">
                R{product.price}
              </p>
              <p className="text-xs text-muted-foreground">
                {product.stock} in stock
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full"
          disabled={product.stock === 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};
