import { useState, useMemo } from 'react';
import { ComboCard } from '@/components/ComboCard';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

export const Combos = () => {
  const { products } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([200, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter products to only show combos
  const comboProducts = useMemo(() => {
    let filtered = products.filter(product => product.category === 'Combos');

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
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
  }, [products, searchQuery, sortBy, priceRange]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Premium Combo Sets
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover our carefully curated product combinations for complete skincare routines. 
              Save more when you buy together!
            </p>
          </div>
        </div>
      </section>

      <div className="container py-8">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search combo sets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full md:w-auto"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-muted/50 p-6 rounded-lg space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price-range">Price Range: R{priceRange[0]} - R{priceRange[1]}</Label>
                <Slider
                  id="price-range"
                  min={200}
                  max={1000}
                  step={50}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            {comboProducts.length} Combo Set{comboProducts.length !== 1 ? 's' : ''} Found
          </h2>
        </div>

        {/* Products Grid */}
        {comboProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {comboProducts.map((product) => (
              <ComboCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No combo sets found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setPriceRange([200, 1000]);
                setSortBy('name');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Benefits Section */}
        <section className="mt-16 py-12 bg-muted/30 rounded-lg">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-8">Why Choose Our Combo Sets?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-2">Save Money</h3>
                <p className="text-muted-foreground">
                  Get better value when you buy products together in our curated sets
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold mb-2">Complete Routines</h3>
                <p className="text-muted-foreground">
                  Everything you need for a complete skincare routine in one package
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🎁</div>
                <h3 className="text-xl font-semibold mb-2">Perfect Gifts</h3>
                <p className="text-muted-foreground">
                  Beautifully packaged sets make perfect gifts for loved ones
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
