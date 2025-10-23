import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, Address } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export const Checkout = () => {
  const { cart, user, placeOrder } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 50;
  const total = subtotal + shipping;

  useEffect(() => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/auth');
    } else if (cart.length === 0) {
      navigate('/cart');
    }
  }, [user, cart, navigate]);

  if (!user || cart.length === 0) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const address: Address = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      street: formData.street,
      city: formData.city,
      province: formData.province,
      postalCode: formData.postalCode,
      phone: formData.phone,
    };

    const order = placeOrder(address);
    toast.success('Order placed successfully!');
    navigate(`/order-confirmation/${order.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-4 sm:py-8 px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      required
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="province">Province</Label>
                      <Input
                        id="province"
                        required
                        value={formData.province}
                        onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    />
                  </div>

                  <div className="pt-4">
                    <h3 className="font-semibold mb-4">Payment Method</h3>
                    <div className="border rounded-lg p-4 bg-secondary/20">
                      <p className="text-sm text-muted-foreground mb-2">
                        Pay securely with Paystack
                      </p>
                      <Button type="submit" size="lg" className="w-full">
                        Place Order - R{total.toFixed(2)}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        * Payment processing will be enabled in production
                      </p>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-4 lg:top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate flex-1 mr-2">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-medium">R{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">R{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">R{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base sm:text-lg font-bold">
                    <span>Total</span>
                    <span>R{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
