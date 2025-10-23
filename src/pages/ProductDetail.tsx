import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Star, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ReviewCard } from '@/components/ReviewCard';
import { ReviewForm } from '@/components/ReviewForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, addToWishlist, removeFromWishlist, wishlist, getProductReviews, markReviewHelpful } = useApp();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Button onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    );
  }

  const isInWishlist = wishlist.some(item => item.id === product.id);
  const reviews = getProductReviews(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} x ${product.name} added to cart`);
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-4 sm:py-8 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-secondary/20">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-2">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-accent text-accent'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <p className="text-3xl sm:text-4xl font-bold text-primary mb-4">R{product.price}</p>
              <p className="text-muted-foreground text-sm sm:text-base">{product.description}</p>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Stock: <span className="font-medium text-foreground">{product.stock} available</span>
              </p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium text-sm sm:text-base">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleToggleWishlist}
                  className="sm:w-auto"
                >
                  <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isInWishlist ? 'fill-current text-accent' : ''}`} />
                </Button>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3">Product Benefits</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ 100% organic and natural ingredients</li>
                <li>✓ Cruelty-free and ethically sourced</li>
                <li>✓ No harmful chemicals or synthetic fragrances</li>
                <li>✓ Suitable for all skin types</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews and Details Section */}
        <div className="mt-8 sm:mt-16">
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reviews" className="text-xs sm:text-sm">Reviews ({reviews.length})</TabsTrigger>
              <TabsTrigger value="write-review" className="text-xs sm:text-sm">Write Review</TabsTrigger>
              <TabsTrigger value="details" className="text-xs sm:text-sm">Product Details</TabsTrigger>
            </TabsList>
          
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onMarkHelpful={markReviewHelpful}
                  />
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="write-review" className="mt-6">
            <ReviewForm
              productId={product.id}
              onReviewSubmitted={() => {
                // Optionally scroll to reviews tab or show success message
                toast.success('Review submitted successfully!');
              }}
            />
          </TabsContent>
          
          <TabsContent value="details" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Product Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight:</span>
                    <span>{product.weight}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dimensions:</span>
                    <span>{product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span>{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stock:</span>
                    <span>{product.stock} available</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Benefits</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ 100% organic and natural ingredients</li>
                  <li>✓ Cruelty-free and ethically sourced</li>
                  <li>✓ No harmful chemicals or synthetic fragrances</li>
                  <li>✓ Suitable for all skin types</li>
                  <li>✓ Made with love in South Africa</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
