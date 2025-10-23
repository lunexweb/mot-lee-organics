import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, Shield, Sparkles, Star, ShoppingCart } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { useApp } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';
import heroImage from '@/assets/hero-image.jpg';

export const Home = () => {
  const { products, addToCart } = useApp();
  const navigate = useNavigate();
  const featuredProducts = products.slice(0, 4);
  const heroProducts = products.slice(0, 3);

  const handleProductClick = (productId: string) => {
    // Scroll to top first
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    // Then navigate
    navigate(`/products/${productId}`);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section with Products */}
      <section className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        <div className="container relative h-full px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[500px] sm:min-h-[600px]">
            
            {/* Left Side - Content */}
            <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  🌿 100% Organic & Natural
                </Badge>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Dark Marks Out.
                  <span className="block text-primary">Flawless Skin In.</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg">
                  Brightening serums that fade pigmentation and bring your natural radiance to bloom.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <Link to="/products">
                    Shop <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                  <Link to="/combos">View Combos</Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span>Certified Organic</span>
                </div>
                <div className="flex items-center gap-1">
                  <Leaf className="h-4 w-4" />
                  <span>Natural Ingredients</span>
                </div>
              </div>
            </div>

            {/* Right Side - Product Display */}
            <div className="relative animate-fade-in-up [animation-delay:200ms]">
              <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px]">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-3xl"></div>
                
                {/* Product Display */}
                <div className="relative h-full flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full max-w-md">
                    {heroProducts.map((product, index) => (
                      <div 
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className={`flex flex-col items-center space-y-3 group cursor-pointer w-full ${
                          index === 1 ? 'transform translate-y-4' : ''
                        }`}
                      >
                        {/* Product Image Container - Fully Clickable */}
                        <div className="relative w-full flex justify-center">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white/80 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden group-hover:shadow-xl transition-shadow duration-300">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          
                          {/* Hover Overlay - Only for Add to Cart */}
                          <div className="absolute inset-0 bg-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart(product.id);
                              }}
                              className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                              <ShoppingCart className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Product Info - Also Clickable */}
                        <div className="text-center space-y-1 w-full">
                          <h3 className="text-xs sm:text-sm font-medium text-foreground leading-tight group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-xs text-muted-foreground font-semibold">
                            R{product.price}
                          </p>
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-muted-foreground">{product.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  Best Seller
                </div>
                <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                  New Arrival
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Product Showcase */}
      <section className="py-8 sm:py-12 bg-background">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Shop Our Best Sellers</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Quick access to our most popular products</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {featuredProducts.map((product) => (
              <div 
                key={product.id} 
                onClick={() => handleProductClick(product.id)}
                className="group cursor-pointer block w-full"
              >
                <div className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-3 sm:p-4 group-hover:scale-[1.02] w-full">
                  {/* Image - Fully Clickable */}
                  <div className="aspect-square mb-3 bg-muted/30 rounded-lg overflow-hidden w-full">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Product Info - Also Clickable */}
                  <div className="space-y-1 w-full">
                    <h3 className="text-xs sm:text-sm font-medium text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">R{product.price}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <Button variant="outline" asChild>
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex flex-col items-center text-center p-4 sm:p-6 animate-fade-in">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">100% Organic</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                All products made with certified organic ingredients
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 sm:p-6 animate-fade-in [animation-delay:100ms]">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Rigorously tested for purity and effectiveness
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 sm:p-6 animate-fade-in [animation-delay:200ms] sm:col-span-2 lg:col-span-1">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Radiant Results</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                See visible improvements in your skin's health
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Featured Products</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Discover our most-loved organic essentials</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-primary text-primary-foreground">
        <div className="container px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
            Ready to Transform Your Skincare Routine?
          </h2>
          <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Mot-Lee Organics for their beauty and wellness needs.
          </p>
          <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto">
            <Link to="/products">
              Start Shopping <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};
