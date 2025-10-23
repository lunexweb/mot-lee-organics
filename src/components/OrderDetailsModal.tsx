import { useState } from 'react';
import { Order, Customer } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Package, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Truck, 
  CreditCard,
  X,
  Edit,
  Save,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderDetailsModalProps {
  order: Order | null;
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  onAddNote?: (orderId: string, note: string) => void;
}

export const OrderDetailsModal = ({ 
  order, 
  customer, 
  isOpen, 
  onClose, 
  onUpdateStatus,
  onAddNote 
}: OrderDetailsModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState<Order['status']>('pending');
  const [adminNote, setAdminNote] = useState('');

  if (!order) return null;

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = () => {
    onUpdateStatus(order.id, newStatus);
    setIsEditing(false);
    toast.success('Order status updated successfully');
  };

  const handleAddNote = () => {
    if (onAddNote && adminNote.trim()) {
      onAddNote(order.id, adminNote);
      setAdminNote('');
      toast.success('Note added to order');
    }
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    toast.success('Order ID copied to clipboard');
  };

  const copyTrackingNumber = () => {
    if (order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      toast.success('Tracking number copied to clipboard');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details - #{order.id}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Information */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Order Date</span>
                  </div>
                  <span className="font-medium">{order.createdAt.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Order ID</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{order.id}</span>
                    <Button variant="ghost" size="sm" onClick={copyOrderId}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {order.trackingNumber && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{order.trackingNumber}</span>
                      <Button variant="ghost" size="sm" onClick={copyTrackingNumber}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Select value={newStatus} onValueChange={(value: Order['status']) => setNewStatus(value)}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button size="sm" onClick={handleStatusUpdate}>
                          <Save className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            {customer && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{order.shippingAddress.phone}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div className="text-sm">
                    <p className="font-medium">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items & Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">SKU: {item.sku || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">R{item.price.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">R{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R{order.subtotal.toFixed(2)}</span>
                </div>
                
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-R{order.discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>R{order.shipping.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>R{order.total.toFixed(2)}</span>
                </div>

                {order.appliedCoupon && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Applied Coupon</p>
                    <p className="text-sm text-green-700">{order.appliedCoupon.coupon.code}</p>
                    <p className="text-sm text-green-700">Saved: R{order.appliedCoupon.discountAmount.toFixed(2)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Admin Notes */}
            {onAddNote && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Admin Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="adminNote">Add Note</Label>
                    <Textarea
                      id="adminNote"
                      placeholder="Add a note about this order..."
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleAddNote} disabled={!adminNote.trim()}>
                    Add Note
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
