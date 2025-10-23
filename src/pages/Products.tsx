import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '@/components/ProductCard';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Filter, X } from 'lucide-react';

const categories = ['All', 'Oils', 'Scrubs', 'Soaps', 'Lotions', 'Teas', 'Supplements', 'Creams', 'Combos'];

export const Products = () => {
  const { products } = useApp();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by search query
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return sorted;
  }, [products, searchParams, selectedCategory, sortBy, priceRange]);

  // Mobile Filters Component
  const MobileFilters = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4 text-base">Categories</h3>
        <div className="grid grid-cols-2 gap-2">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'ghost'}
              className="w-full justify-start text-sm h-10"
              onClick={() => {
                setSelectedCategory(cat);
                setIsFiltersOpen(false);
              }}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-4 block text-base">Price Range</Label>
        <Slider
          min={0}
          max={300}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mb-3"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>R{priceRange[0]}</span>
          <span>R{priceRange[1]}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="container py-4 sm:py-8 px-4 sm:px-6 max-w-full">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block lg:w-64 space-y-6">
            <div>
              <h3 className="font-semibold mb-4 text-base">Categories</h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'ghost'}
                    className="w-full justify-start text-sm h-9"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-4 block text-base">Price Range</Label>
              <Slider
                min={0}
                max={300}
                step={10}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mb-3"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>R{priceRange[0]}</span>
                <span>R{priceRange[1]}</span>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filters Button */}
            <div className="lg:hidden mb-4">
              <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full justify-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
                  <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsFiltersOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-6">
                    <MobileFilters />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <p className="text-muted-foreground text-xs sm:text-sm">
                {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''} found
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px] h-8 sm:h-9">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <p className="text-muted-foreground text-sm sm:text-base">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
