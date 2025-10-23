import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { orders } = useApp();

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl">
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Order Number</p>
            <p className="font-mono font-bold">{order.id}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Order Date</p>
            <p className="font-medium">{order.createdAt.toLocaleDateString()}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-3">Items Ordered</p>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-medium">R{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>R{order.total.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Shipping Address</p>
            <div className="text-sm">
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button asChild className="flex-1">
              <Link to="/dashboard">View Orders</Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
