import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Tag } from 'lucide-react';
import { toast } from 'sonner';

export const CouponInput = () => {
  const { appliedCoupon, applyCoupon, removeCoupon } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsLoading(true);
    const result = applyCoupon(couponCode.trim());
    
    if (result.success) {
      toast.success(result.message);
      setCouponCode('');
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast.success('Coupon removed');
  };

  return (
    <Card>
      <CardContent className="p-4">
        {appliedCoupon ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-600">Coupon Applied</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveCoupon}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-green-800">{appliedCoupon.coupon.code}</p>
                  <p className="text-sm text-green-600">{appliedCoupon.coupon.description}</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  -R{appliedCoupon.discountAmount.toFixed(2)}
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Have a coupon code?</span>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                className="flex-1"
              />
              <Button
                onClick={handleApplyCoupon}
                disabled={isLoading || !couponCode.trim()}
                size="sm"
              >
                {isLoading ? 'Applying...' : 'Apply'}
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Try: WELCOME10, SAVE50, FREESHIP, or VIP20
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
