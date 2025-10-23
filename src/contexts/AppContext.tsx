import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { EmailService } from '@/services/emailService';
import { TrackingService } from '@/services/trackingService';
import { RateLimitingService } from '@/services/rateLimitingService';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: Date;
  verified: boolean;
  helpful: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  timestamp: Date;
  userId?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Oils' | 'Scrubs' | 'Soaps' | 'Lotions' | 'Teas' | 'Supplements' | 'Creams' | 'Combos';
  image: string;
  stock: number;
  minStock: number; // minimum stock level for alerts
  maxStock: number; // maximum stock level
  rating: number;
  reviews: number;
  weight: number; // in grams for shipping calculations
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  sku: string; // Stock Keeping Unit
  cost: number; // cost price for profit calculations
  lastRestocked: Date;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  addresses: Address[];
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // percentage (0-100) or fixed amount in ZAR
  minOrderAmount?: number;
  maxDiscount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  description: string;
}

export interface AppliedCoupon {
  coupon: Coupon;
  discountAmount: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  appliedCoupon?: AppliedCoupon;
  trackingNumber?: string;
  createdAt: Date;
}

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  user: User | null;
  orders: Order[];
  customers: User[];
  reviews: Review[];
  stockMovements: StockMovement[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  placeOrder: (shippingAddress: Address) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProfile: (updates: Partial<User>) => void;
  addReview: (productId: string, rating: number, title: string, comment: string) => void;
  getProductReviews: (productId: string) => Review[];
  markReviewHelpful: (reviewId: string) => void;
  // Inventory management functions
  adjustStock: (productId: string, quantity: number, reason: string) => void;
  restockProduct: (productId: string, quantity: number, cost: number) => void;
  getLowStockProducts: () => Product[];
  getStockMovements: (productId?: string) => StockMovement[];
  getInventoryValue: () => number;
  getLowStockAlerts: () => { product: Product; currentStock: number; minStock: number }[];
  // Coupon functions
  coupons: Coupon[];
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

import carrotOilImg from '@/assets/products/carrot-oil.jpg';
import stretchMarkOilImg from '@/assets/products/stretch-mark-oil.jpg';
import glowSerumImg from '@/assets/products/glow-serum.jpg';
import rooibosOilImg from '@/assets/products/rooibos-oil.jpg';
import charcoalScrubImg from '@/assets/products/charcoal-scrub.jpg';
import charcoalSoapImg from '@/assets/products/charcoal-soap.jpg';
import turmericScrubImg from '@/assets/products/turmeric-scrub.jpg';
import turmericLotionImg from '@/assets/products/turmeric-lotion.jpg';
import turmericSoapImg from '@/assets/products/turmeric-soap.jpg';
import thighTreatmentImg from '@/assets/products/thigh-treatment.jpg';
import stretchMarkCreamImg from '@/assets/products/stretch-mark-cream.jpg';
import sheaButterImg from '@/assets/products/shea-butter.jpg';
import collagenPowderImg from '@/assets/products/collagen-powder.jpg';
import hibiscusTeaImg from '@/assets/products/hibiscus-tea.jpg';
import roseTeaImg from '@/assets/products/rose-tea.jpg';

const mockProducts: Product[] = [
  { id: '1', name: 'Carrot Tissue Oil', description: 'Nourishing carrot oil for glowing skin', price: 100, category: 'Oils', image: carrotOilImg, stock: 25, minStock: 10, maxStock: 100, rating: 4.8, reviews: 42, weight: 150, dimensions: { length: 8, width: 4, height: 15 }, sku: 'CTO-001', cost: 45, lastRestocked: new Date('2025-01-15'), tags: ['organic', 'skincare', 'glowing', 'natural'], isActive: true },
  { id: '2', name: 'Stretch Mark Oil', description: 'Reduce appearance of stretch marks naturally', price: 120, category: 'Oils', image: stretchMarkOilImg, stock: 18, minStock: 8, maxStock: 80, rating: 4.9, reviews: 58, weight: 180, dimensions: { length: 8, width: 4, height: 15 }, sku: 'SMO-002', cost: 55, lastRestocked: new Date('2025-01-10') },
  { id: '3', name: 'Glow Serum', description: 'Intensive glow-boosting serum with natural extracts', price: 150, category: 'Oils', image: glowSerumImg, stock: 30, minStock: 12, maxStock: 120, rating: 4.9, reviews: 67, weight: 120, dimensions: { length: 6, width: 3, height: 12 }, sku: 'GS-003', cost: 70, lastRestocked: new Date('2025-01-18') },
  { id: '4', name: 'Rooibos Tissue Oil', description: 'Antioxidant-rich rooibos oil for skin repair', price: 100, category: 'Oils', image: rooibosOilImg, stock: 22, minStock: 10, maxStock: 100, rating: 4.7, reviews: 38, weight: 150, dimensions: { length: 8, width: 4, height: 15 }, sku: 'RTO-004', cost: 45, lastRestocked: new Date('2025-01-12') },
  { id: '5', name: 'Activated Charcoal Scrub', description: 'Deep cleansing charcoal body scrub', price: 90, category: 'Scrubs', image: charcoalScrubImg, stock: 35, minStock: 15, maxStock: 150, rating: 4.8, reviews: 54, weight: 300, dimensions: { length: 10, width: 6, height: 8 }, sku: 'ACS-005', cost: 35, lastRestocked: new Date('2025-01-20') },
  { id: '6', name: 'Charcoal Soap', description: 'Detoxifying charcoal bar soap', price: 80, category: 'Soaps', image: charcoalSoapImg, stock: 40, minStock: 20, maxStock: 200, rating: 4.6, reviews: 45, weight: 100, dimensions: { length: 8, width: 5, height: 3 }, sku: 'CS-006', cost: 25, lastRestocked: new Date('2025-01-16') },
  { id: '7', name: 'Turmeric Scrub', description: 'Brightening turmeric body scrub', price: 90, category: 'Scrubs', image: turmericScrubImg, stock: 28, minStock: 12, maxStock: 120, rating: 4.9, reviews: 61, weight: 300, dimensions: { length: 10, width: 6, height: 8 }, sku: 'TS-007', cost: 35, lastRestocked: new Date('2025-01-14') },
  { id: '8', name: 'Turmeric Lotion', description: 'Moisturizing turmeric body lotion', price: 90, category: 'Lotions', image: turmericLotionImg, stock: 32, minStock: 15, maxStock: 150, rating: 4.7, reviews: 48, weight: 250, dimensions: { length: 8, width: 5, height: 12 }, sku: 'TL-008', cost: 30, lastRestocked: new Date('2025-01-17') },
  { id: '9', name: 'Turmeric Soap', description: 'Natural turmeric cleansing bar', price: 80, category: 'Soaps', image: turmericSoapImg, stock: 45, minStock: 20, maxStock: 200, rating: 4.8, reviews: 52, weight: 100, dimensions: { length: 8, width: 5, height: 3 }, sku: 'TS-009', cost: 25, lastRestocked: new Date('2025-01-19') },
  { id: '10', name: 'Dark Inner Thighs Treatment', description: 'Targeted cream for brightening dark areas', price: 100, category: 'Creams', image: thighTreatmentImg, stock: 20, minStock: 8, maxStock: 80, rating: 4.8, reviews: 39, weight: 200, dimensions: { length: 7, width: 4, height: 10 }, sku: 'DITT-010', cost: 40, lastRestocked: new Date('2025-01-11') },
  { id: '11', name: 'Stretch Marks Remover', description: 'Intensive stretch mark treatment cream', price: 100, category: 'Creams', image: stretchMarkCreamImg, stock: 24, minStock: 10, maxStock: 100, rating: 4.9, reviews: 56, weight: 200, dimensions: { length: 7, width: 4, height: 10 }, sku: 'SMRC-011', cost: 40, lastRestocked: new Date('2025-01-13') },
  { id: '12', name: 'Shea Butter Cream', description: 'Pure shea butter moisturizing cream', price: 100, category: 'Creams', image: sheaButterImg, stock: 30, minStock: 12, maxStock: 120, rating: 4.7, reviews: 44, weight: 200, dimensions: { length: 7, width: 4, height: 10 }, sku: 'SBC-012', cost: 40, lastRestocked: new Date('2025-01-21') },
  { id: '13', name: 'Collagen Powder', description: 'Premium marine collagen supplement', price: 280, category: 'Supplements', image: collagenPowderImg, stock: 15, minStock: 5, maxStock: 50, rating: 4.9, reviews: 73, weight: 500, dimensions: { length: 12, width: 8, height: 20 }, sku: 'CP-013', cost: 120, lastRestocked: new Date('2025-01-09') },
  { id: '14', name: 'Hibiscus Tea', description: 'Organic hibiscus tea for wellness', price: 85, category: 'Teas', image: hibiscusTeaImg, stock: 50, minStock: 20, maxStock: 200, rating: 4.6, reviews: 41, weight: 100, dimensions: { length: 15, width: 10, height: 5 }, sku: 'HT-014', cost: 30, lastRestocked: new Date('2025-01-22') },
  { id: '15', name: 'Rose Petal Tea', description: 'Delicate rose petal herbal tea', price: 90, category: 'Teas', image: roseTeaImg, stock: 45, minStock: 18, maxStock: 180, rating: 4.7, reviews: 36, weight: 100, dimensions: { length: 15, width: 10, height: 5 }, sku: 'RPT-015', cost: 35, lastRestocked: new Date('2025-01-23'), tags: ['rose', 'tea', 'herbal', 'delicate'], isActive: true },
  { id: '16', name: 'Discontinued Product', description: 'This product is no longer available', price: 50, category: 'Oils', image: '/placeholder.svg', stock: 0, minStock: 0, maxStock: 0, rating: 3.0, reviews: 5, weight: 100, dimensions: { length: 5, width: 3, height: 8 }, sku: 'DIS-016', cost: 20, lastRestocked: new Date('2024-12-01'), tags: ['discontinued', 'old'], isActive: false },
  // Combo Products
  { id: '17', name: 'Turmeric Complete Set', description: 'Complete turmeric skincare routine with scrub, lotion, soap, and carrot oil', price: 360, category: 'Combos', image: turmericScrubImg, stock: 15, minStock: 5, maxStock: 50, rating: 4.9, reviews: 28, weight: 850, dimensions: { length: 25, width: 15, height: 20 }, sku: 'TCS-017', cost: 135, lastRestocked: new Date('2025-01-20'), tags: ['combo', 'turmeric', 'complete-set', 'skincare'], isActive: true },
  { id: '18', name: 'Turmeric Trio', description: 'Essential turmeric products: scrub, lotion, and soap', price: 260, category: 'Combos', image: turmericLotionImg, stock: 20, minStock: 8, maxStock: 60, rating: 4.8, reviews: 35, weight: 500, dimensions: { length: 20, width: 12, height: 15 }, sku: 'TT-018', cost: 90, lastRestocked: new Date('2025-01-18'), tags: ['combo', 'turmeric', 'trio', 'skincare'], isActive: true },
  { id: '19', name: 'Charcoal & Rooibos Set', description: 'Detoxifying charcoal products with rooibos oil and shea butter', price: 370, category: 'Combos', image: charcoalScrubImg, stock: 12, minStock: 4, maxStock: 40, rating: 4.9, reviews: 22, weight: 750, dimensions: { length: 22, width: 14, height: 18 }, sku: 'CRS-019', cost: 140, lastRestocked: new Date('2025-01-19'), tags: ['combo', 'charcoal', 'rooibos', 'detox'], isActive: true },
  { id: '20', name: 'Glow Serum Bulk Pack', description: '10 bottles of premium glow serum for intensive treatment', price: 800, category: 'Combos', image: glowSerumImg, stock: 8, minStock: 2, maxStock: 20, rating: 4.9, reviews: 15, weight: 1200, dimensions: { length: 30, width: 20, height: 25 }, sku: 'GSB-020', cost: 600, lastRestocked: new Date('2025-01-21'), tags: ['combo', 'glow-serum', 'bulk', 'intensive'], isActive: true },
];

// Mock demo customers
const mockCustomers: User[] = [
  {
    id: 'cust_001',
    email: 'customer@demo.com',
    name: 'Sarah Johnson',
    role: 'customer',
    addresses: [{
      id: 'addr_001',
      name: 'Sarah Johnson',
      street: '123 Main Street',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '8001',
      phone: '+27 21 123 4567'
    }]
  },
  {
    id: 'cust_002',
    email: 'john@demo.com',
    name: 'John Smith',
    role: 'customer',
    addresses: [{
      id: 'addr_002',
      name: 'John Smith',
      street: '456 Oak Avenue',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2000',
      phone: '+27 11 987 6543'
    }]
  },
  {
    id: 'cust_003',
    email: 'mary@demo.com',
    name: 'Mary Williams',
    role: 'customer',
    addresses: [{
      id: 'addr_003',
      name: 'Mary Williams',
      street: '789 Beach Road',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      postalCode: '4001',
      phone: '+27 31 555 8888'
    }]
  }
];

// Mock demo orders
const mockOrders: Order[] = [
  {
    id: 'ord_001',
    userId: 'cust_001',
    items: [
      { ...mockProducts[0], quantity: 2 },
      { ...mockProducts[4], quantity: 1 }
    ],
    total: 290,
    status: 'delivered',
    shippingAddress: mockCustomers[0].addresses[0],
    createdAt: new Date('2025-01-15')
  },
  {
    id: 'ord_002',
    userId: 'cust_002',
    items: [
      { ...mockProducts[2], quantity: 1 },
      { ...mockProducts[12], quantity: 1 }
    ],
    total: 430,
    status: 'shipped',
    shippingAddress: mockCustomers[1].addresses[0],
    createdAt: new Date('2025-01-18')
  },
  {
    id: 'ord_003',
    userId: 'cust_001',
    items: [
      { ...mockProducts[6], quantity: 2 },
      { ...mockProducts[7], quantity: 1 }
    ],
    total: 270,
    status: 'processing',
    shippingAddress: mockCustomers[0].addresses[0],
    createdAt: new Date('2025-01-20')
  },
  {
    id: 'ord_004',
    userId: 'cust_003',
    items: [
      { ...mockProducts[10], quantity: 1 },
      { ...mockProducts[11], quantity: 1 }
    ],
    total: 200,
    status: 'pending',
    shippingAddress: mockCustomers[2].addresses[0],
    createdAt: new Date('2025-01-21')
  }
];

// Mock reviews
const mockReviews: Review[] = [
  {
    id: 'rev_001',
    productId: '1',
    userId: 'cust_001',
    userName: 'Sarah Johnson',
    rating: 5,
    title: 'Amazing results!',
    comment: 'This carrot oil has transformed my skin. I can see a noticeable glow after just 2 weeks of use. Highly recommended!',
    createdAt: new Date('2025-01-10'),
    verified: true,
    helpful: 12
  },
  {
    id: 'rev_002',
    productId: '1',
    userId: 'cust_002',
    userName: 'John Smith',
    rating: 4,
    title: 'Good product',
    comment: 'Nice oil, absorbs well and doesn\'t feel greasy. Takes a bit longer to see results but worth the wait.',
    createdAt: new Date('2025-01-12'),
    verified: true,
    helpful: 8
  },
  {
    id: 'rev_003',
    productId: '2',
    userId: 'cust_003',
    userName: 'Mary Williams',
    rating: 5,
    title: 'Works wonders!',
    comment: 'I\'ve been using this for my stretch marks and I can already see improvement. The texture is perfect and it smells lovely.',
    createdAt: new Date('2025-01-08'),
    verified: true,
    helpful: 15
  },
  {
    id: 'rev_004',
    productId: '3',
    userId: 'cust_001',
    userName: 'Sarah Johnson',
    rating: 5,
    title: 'Best serum ever!',
    comment: 'This glow serum is incredible. My skin looks radiant and healthy. Worth every penny!',
    createdAt: new Date('2025-01-15'),
    verified: true,
    helpful: 20
  },
  {
    id: 'rev_005',
    productId: '5',
    userId: 'cust_002',
    userName: 'John Smith',
    rating: 4,
    title: 'Great scrub',
    comment: 'The charcoal scrub leaves my skin feeling clean and smooth. The texture is perfect - not too harsh.',
    createdAt: new Date('2025-01-14'),
    verified: true,
    helpful: 6
  }
];

// Mock stock movements
const mockStockMovements: StockMovement[] = [
  { id: 'sm_001', productId: '1', type: 'in', quantity: 50, reason: 'Initial stock', timestamp: new Date('2025-01-01'), userId: 'admin' },
  { id: 'sm_002', productId: '1', type: 'out', quantity: 25, reason: 'Sales', timestamp: new Date('2025-01-15'), userId: 'system' },
  { id: 'sm_003', productId: '2', type: 'in', quantity: 30, reason: 'Restock', timestamp: new Date('2025-01-10'), userId: 'admin' },
  { id: 'sm_004', productId: '2', type: 'out', quantity: 12, reason: 'Sales', timestamp: new Date('2025-01-18'), userId: 'system' },
  { id: 'sm_005', productId: '3', type: 'in', quantity: 40, reason: 'Restock', timestamp: new Date('2025-01-18'), userId: 'admin' },
  { id: 'sm_006', productId: '3', type: 'out', quantity: 10, reason: 'Sales', timestamp: new Date('2025-01-20'), userId: 'system' },
];

// Mock coupons
const mockCoupons: Coupon[] = [
  {
    id: 'coupon_001',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minOrderAmount: 200,
    maxDiscount: 50,
    validFrom: new Date('2025-01-01'),
    validUntil: new Date('2025-12-31'),
    usageLimit: 1000,
    usedCount: 45,
    isActive: true,
    description: '10% off your first order (min R200)'
  },
  {
    id: 'coupon_002',
    code: 'SAVE50',
    type: 'fixed',
    value: 50,
    minOrderAmount: 300,
    validFrom: new Date('2025-01-01'),
    validUntil: new Date('2025-06-30'),
    usageLimit: 500,
    usedCount: 123,
    isActive: true,
    description: 'R50 off orders over R300'
  },
  {
    id: 'coupon_003',
    code: 'FREESHIP',
    type: 'fixed',
    value: 0,
    minOrderAmount: 500,
    validFrom: new Date('2025-01-01'),
    validUntil: new Date('2025-12-31'),
    usageLimit: 2000,
    usedCount: 89,
    isActive: true,
    description: 'Free shipping on orders over R500'
  },
  {
    id: 'coupon_004',
    code: 'VIP20',
    type: 'percentage',
    value: 20,
    minOrderAmount: 1000,
    maxDiscount: 200,
    validFrom: new Date('2025-01-01'),
    validUntil: new Date('2025-12-31'),
    usageLimit: 100,
    usedCount: 12,
    isActive: true,
    description: '20% off orders over R1000 (max R200 discount)'
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [customers, setCustomers] = useState<User[]>(mockCustomers);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(mockStockMovements);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stock) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }
    
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const addToWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Check rate limit
    const rateLimitResult = RateLimitingService.checkRateLimit(email, 'login');
    if (!rateLimitResult.allowed) {
      toast.error(rateLimitResult.message || 'Too many login attempts. Please try again later.');
      return false;
    }

    // Mock login
    const isAdmin = email === 'admin@motlee.com';
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role: isAdmin ? 'admin' : 'customer',
      addresses: [],
    };
    setUser(mockUser);
    return true;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    // Check rate limit
    const rateLimitResult = RateLimitingService.checkRateLimit(email, 'register');
    if (!rateLimitResult.allowed) {
      toast.error(rateLimitResult.message || 'Too many registration attempts. Please try again later.');
      return false;
    }

    // Mock registration
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: 'customer',
      addresses: [],
    };
    setUser(mockUser);
    setCustomers(prev => [...prev, mockUser]);
    
    // Send welcome email
    EmailService.sendEmail({
      to: email,
      template: EmailService.generateWelcomeEmailTemplate({
        customer: mockUser
      })
    });
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
  };

  const placeOrder = (shippingAddress: Address, shippingCost: number = 0): Order => {
    if (!user) throw new Error('User must be logged in');
    
    // Check stock availability
    for (const item of cart) {
      if (item.quantity > item.stock) {
        throw new Error(`Insufficient stock for ${item.name}. Only ${item.stock} available.`);
      }
    }
    
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = appliedCoupon?.discountAmount || 0;
    const total = subtotal - discount + shippingCost;
    
    const orderId = Math.random().toString(36).substr(2, 9);
    const trackingNumber = TrackingService.generateTrackingNumber(orderId);
    
    const order: Order = {
      id: orderId,
      userId: user.id,
      items: [...cart],
      subtotal,
      discount,
      shipping: shippingCost,
      total,
      status: 'pending',
      shippingAddress,
      appliedCoupon: appliedCoupon || undefined,
      trackingNumber,
      createdAt: new Date(),
    };
    
    // Reduce stock for each item
    cart.forEach(item => {
      adjustStock(item.id, -item.quantity, `Order ${order.id}`);
    });
    
    // Increment coupon usage count
    if (appliedCoupon) {
      updateCoupon(appliedCoupon.coupon.id, { 
        usedCount: appliedCoupon.coupon.usedCount + 1 
      });
    }
    
    setOrders(prev => [...prev, order]);
    
    // Initialize tracking
    TrackingService.createTrackingInfo(order.id);
    
    // Send order confirmation email
    EmailService.sendEmail({
      to: user.email,
      template: EmailService.generateOrderConfirmationTemplate({
        order,
        customer: user
      })
    });
    
    clearCart();
    setAppliedCoupon(null);
    return order;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );

    // Update tracking status
    if (order.trackingNumber) {
      const trackingStatusMap: Record<string, any> = {
        'processing': 'in_transit',
        'shipped': 'in_transit',
        'delivered': 'delivered',
        'cancelled': 'exception'
      };

      const trackingStatus = trackingStatusMap[status];
      if (trackingStatus) {
        TrackingService.updateTrackingStatus(
          order.trackingNumber,
          trackingStatus,
          'Mot-Lee Organics',
          `Order status updated to ${status}`
        );
      }
    }

    // Send status update email
    const customer = customers.find(c => c.id === order.userId);
    if (customer) {
      EmailService.sendEmail({
        to: customer.email,
        template: EmailService.generateOrderStatusUpdateTemplate({
          order: { ...order, status },
          customer,
          newStatus: status
        })
      });
    }
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const addReview = (productId: string, rating: number, title: string, comment: string) => {
    if (!user) {
      toast.error('You must be logged in to leave a review');
      return;
    }

    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      productId,
      userId: user.id,
      userName: user.name,
      rating,
      title,
      comment,
      createdAt: new Date(),
      verified: false,
      helpful: 0
    };

    setReviews(prev => [...prev, newReview]);
    
    // Update product rating
    const productReviews = reviews.filter(r => r.productId === productId);
    const allReviews = [...productReviews, newReview];
    const newRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    updateProduct(productId, { 
      rating: Math.round(newRating * 10) / 10, 
      reviews: allReviews.length 
    });
    
    toast.success('Review submitted successfully!');
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter(review => review.productId === productId);
  };

  const markReviewHelpful = (reviewId: string) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId ? { ...review, helpful: review.helpful + 1 } : review
      )
    );
  };

  // Inventory management functions
  const adjustStock = (productId: string, quantity: number, reason: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newStock = Math.max(0, product.stock + quantity);
    
    // Update product stock
    updateProduct(productId, { stock: newStock });
    
    // Record stock movement
    const movement: StockMovement = {
      id: Math.random().toString(36).substr(2, 9),
      productId,
      type: quantity > 0 ? 'in' : 'out',
      quantity: Math.abs(quantity),
      reason,
      timestamp: new Date(),
      userId: user?.id
    };
    
    setStockMovements(prev => [...prev, movement]);
    toast.success(`Stock ${quantity > 0 ? 'increased' : 'decreased'} by ${Math.abs(quantity)} units`);
  };

  const restockProduct = (productId: string, quantity: number, cost: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newStock = product.stock + quantity;
    
    // Update product stock and cost
    updateProduct(productId, { 
      stock: newStock, 
      cost: cost,
      lastRestocked: new Date()
    });
    
    // Record stock movement
    const movement: StockMovement = {
      id: Math.random().toString(36).substr(2, 9),
      productId,
      type: 'in',
      quantity,
      reason: 'Restock',
      timestamp: new Date(),
      userId: user?.id
    };
    
    setStockMovements(prev => [...prev, movement]);
    toast.success(`Restocked ${quantity} units of ${product.name}`);
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.stock <= product.minStock);
  };

  const getStockMovements = (productId?: string) => {
    if (productId) {
      return stockMovements.filter(movement => movement.productId === productId);
    }
    return stockMovements;
  };

  const getInventoryValue = () => {
    return products.reduce((total, product) => total + (product.stock * product.cost), 0);
  };

  const getLowStockAlerts = () => {
    return products
      .filter(product => product.stock <= product.minStock)
      .map(product => ({
        product,
        currentStock: product.stock,
        minStock: product.minStock
      }));
  };

  // Coupon functions
  const applyCoupon = (code: string) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code' };
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return { success: false, message: 'Coupon has expired' };
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { success: false, message: 'Coupon usage limit reached' };
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return { 
        success: false, 
        message: `Minimum order amount of R${coupon.minOrderAmount} required` 
      };
    }

    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else {
      discountAmount = coupon.value;
    }

    const appliedCouponData: AppliedCoupon = {
      coupon,
      discountAmount: Math.min(discountAmount, subtotal)
    };

    setAppliedCoupon(appliedCouponData);
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const addCoupon = (couponData: Omit<Coupon, 'id'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setCoupons(prev => [...prev, newCoupon]);
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons(prev =>
      prev.map(coupon =>
        coupon.id === id ? { ...coupon, ...updates } : coupon
      )
    );
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(coupon => coupon.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        wishlist,
        user,
        orders,
        customers,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        login,
        register,
        logout,
        placeOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProfile,
        reviews,
        addReview,
        getProductReviews,
        markReviewHelpful,
        stockMovements,
        adjustStock,
        restockProduct,
        getLowStockProducts,
        getStockMovements,
        getInventoryValue,
        getLowStockAlerts,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        updateCoupon,
        deleteCoupon,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
