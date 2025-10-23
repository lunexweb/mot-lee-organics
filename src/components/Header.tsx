import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Heart, Search, Menu, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const categories = ['Oils', 'Scrubs', 'Soaps', 'Lotions', 'Teas', 'Supplements', 'Creams', 'Combos'];

export const Header = () => {
  const { cart, user, logout, wishlist } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(''); // Clear search after navigation
    }
  };

  const handleMobileNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-x-hidden">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 md:px-8 max-w-full">
        {/* Logo Section */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm sm:text-lg">🌿</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary leading-none">Mot-Lee</span>
              <span className="text-xs sm:text-sm text-muted-foreground -mt-0.5 sm:-mt-1 tracking-widest">ORGANICS</span>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="hidden md:flex items-center gap-16">
          <Link to="/products" className="text-sm font-medium transition-colors hover:text-primary py-2">
            All Products
          </Link>
          <Link to="/combos" className="text-sm font-medium transition-colors hover:text-primary py-2">
            Combos
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-medium transition-colors hover:text-primary py-2">
              Categories
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories.map(cat => (
                <DropdownMenuItem key={cat} asChild>
                  <Link to={`/products?category=${cat}`}>{cat}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Search Section */}
        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-xs lg:max-w-sm mx-2 sm:mx-4 lg:mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 sm:h-10 text-sm"
            />
          </div>
        </form>

        {/* Mobile Search Overlay */}
        {searchQuery && (
          <div className="sm:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur">
            <div className="flex items-center gap-2 p-4 border-b">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 h-10"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="h-10 px-3"
              >
                Cancel
              </Button>
            </div>
            <div className="p-4">
              <p className="text-sm text-muted-foreground">
                Press Enter to search for "{searchQuery}"
              </p>
            </div>
          </div>
        )}

        {/* Action Icons Section */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden h-9 w-9"
            onClick={() => {
              const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
              if (searchInput) {
                searchInput.focus();
              } else {
                navigate('/products');
              }
            }}
          >
            <Search className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 sm:h-10 sm:w-10"
            onClick={() => navigate('/wishlist')}
          >
            <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center font-medium">
                {wishlist.length}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 sm:h-10 sm:w-10"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-medium">
                {cartItemsCount}
              </span>
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === 'admin' ? (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">My Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" onClick={() => navigate('/auth')} className="h-9 px-3 sm:h-10 sm:px-4 text-sm">
              Login
            </Button>
          )}

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9 ml-2">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-lg font-semibold">All Products</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    {/* Main Categories */}
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">Shop</h3>
                      <div className="space-y-2">
                        <button 
                          onClick={() => handleMobileNavigation('/products')}
                          className="block w-full text-left text-base font-medium py-2 px-3 rounded-md hover:bg-muted transition-colors"
                        >
                          All Products
                        </button>
                        <button 
                          onClick={() => handleMobileNavigation('/combos')}
                          className="block w-full text-left text-base font-medium py-2 px-3 rounded-md hover:bg-muted transition-colors"
                        >
                          Combos
                        </button>
                      </div>
                    </div>
                    
                    {/* Product Categories */}
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">Categories</h3>
                      <div className="space-y-1">
                        {categories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => handleMobileNavigation(`/products?category=${cat}`)}
                            className="block w-full text-left text-sm py-2 px-3 rounded-md hover:bg-muted transition-colors"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
