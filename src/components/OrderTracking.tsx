import { useState, useEffect } from 'react';
import { TrackingService, TrackingInfo } from '@/services/trackingService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Package, Truck, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface OrderTrackingProps {
  trackingNumber?: string;
  onTrackingFound?: (trackingInfo: TrackingInfo) => void;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ 
  trackingNumber: initialTrackingNumber, 
  onTrackingFound 
}) => {
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber || '');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTrackingNumber) {
      handleTrackOrder(initialTrackingNumber);
    }
  }, [initialTrackingNumber]);

  const handleTrackOrder = async (trackNum?: string) => {
    const trackNumber = trackNum || trackingNumber;
    if (!trackNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const info = TrackingService.getTrackingInfo(trackNumber);
      if (info) {
        setTrackingInfo(info);
        onTrackingFound?.(info);
      } else {
        setError('Tracking number not found');
      }
    } catch (err) {
      setError('Failed to fetch tracking information');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: TrackingInfo['status']) => {
    switch (status) {
      case 'pending':
        return <Package className="h-5 w-5" />;
      case 'in_transit':
        return <Truck className="h-5 w-5" />;
      case 'out_for_delivery':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      case 'exception':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: TrackingInfo['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'exception':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!trackingInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Track Your Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tracking-number">Tracking Number</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="tracking-number"
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
              />
              <Button 
                onClick={() => handleTrackOrder()}
                disabled={isLoading || !trackingNumber.trim()}
              >
                {isLoading ? 'Tracking...' : 'Track'}
              </Button>
            </div>
          </div>
          
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tracking Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Order Tracking</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Tracking Number: {trackingInfo.trackingNumber}
              </p>
            </div>
            <Badge className={getStatusColor(trackingInfo.status)}>
              {getStatusIcon(trackingInfo.status)}
              <span className="ml-1">{TrackingService.getStatusDisplayName(trackingInfo.status)}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Carrier</p>
              <p className="font-medium">{trackingInfo.carrier}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Estimated Delivery</p>
              <p className="font-medium">
                {trackingInfo.estimatedDelivery.toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">
                {trackingInfo.lastUpdated.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Tracking History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {TrackingService.formatTrackingEvents(trackingInfo.events).map((event, index) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-primary' : 'bg-muted'
                  }`} />
                  {index < trackingInfo.events.length - 1 && (
                    <div className="w-px h-8 bg-muted mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{event.status}</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {event.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm mt-1">{event.description}</p>
                  {event.details && (
                    <p className="text-xs text-muted-foreground mt-1">{event.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => {
            setTrackingInfo(null);
            setTrackingNumber('');
            setError(null);
          }}
        >
          Track Another Order
        </Button>
        <Button 
          variant="outline"
          onClick={() => handleTrackOrder(trackingInfo.trackingNumber)}
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
    </div>
  );
};
