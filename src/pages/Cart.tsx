import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ShippingService, ShippingOption } from '@/services/shippingService';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CouponInput } from '@/components/CouponInput';

export const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, appliedCoupon } = useApp();
  const navigate = useNavigate();
  const [selectedProvince, setSelectedProvince] = useState('Western Cape');
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Calculate shipping options
  const shippingOptions = cart.length > 0 
    ? ShippingService.calculateShipping(
        cart.map(item => ({
          id: item.id,
          name: item.name,
          weight: item.weight,
          quantity: item.quantity,
          price: item.price
        })),
        selectedProvince,
        subtotal
      )
    : [];

  // Set default shipping option
  if (shippingOptions.length > 0 && !selectedShipping) {
    setSelectedShipping(shippingOptions[0]);
  }

  const shipping = selectedShipping?.price || 0;
  const discount = appliedCoupon?.discountAmount || 0;
  const total = subtotal - discount + shipping;

  if (cart.length === 0) {
    return (
      <div className="container py-16">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some products to get started</p>
            <Button onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-4 sm:py-8 px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1 text-sm sm:text-base">{item.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3">{item.category}</p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center border rounded-lg w-fit">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-medium text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between sm:gap-4">
                          <p className="text-base sm:text-lg font-bold">R{item.price * item.quantity}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              removeFromCart(item.id);
                              toast.success('Item removed from cart');
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card className="sticky top-4 lg:top-24">
              <CardContent className="p-4 sm:p-6 space-y-4">
                <h2 className="text-lg sm:text-xl font-bold">Order Summary</h2>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">R{subtotal.toFixed(2)}</span>
                  </div>
                  
                  {/* Coupon Input */}
                  <CouponInput />
                  
                  {/* Discount Display */}
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon?.coupon.code})</span>
                      <span className="font-medium">-R{discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {/* Shipping Options */}
                  {cart.length > 0 && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Delivery Province</label>
                        <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Western Cape">Western Cape</SelectItem>
                            <SelectItem value="Gauteng">Gauteng</SelectItem>
                            <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                            <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                            <SelectItem value="Free State">Free State</SelectItem>
                            <SelectItem value="Limpopo">Limpopo</SelectItem>
                            <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                            <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                            <SelectItem value="North West">North West</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Shipping Method</label>
                        <div className="space-y-2 mt-1">
                          {shippingOptions.map((option) => (
                            <div
                              key={option.id}
                              className={`p-2 border rounded cursor-pointer ${
                                selectedShipping?.id === option.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                              }`}
                              onClick={() => setSelectedShipping(option)}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">{option.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">{option.description}</p>
                                  <p className="text-xs text-muted-foreground">{option.estimatedDays}</p>
                                </div>
                                <span className="font-medium text-sm ml-2">
                                  {option.isFree ? 'FREE' : `R${option.price.toFixed(2)}`}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'FREE' : `R${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-base sm:text-lg font-bold">
                    <span>Total</span>
                    <span>R{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => navigate('/checkout')}
                  disabled={!selectedShipping}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/products')}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
