export interface TrackingEvent {
  id: string;
  timestamp: Date;
  status: string;
  location: string;
  description: string;
  details?: string;
}

export interface TrackingInfo {
  trackingNumber: string;
  carrier: string;
  status: 'pending' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';
  estimatedDelivery: Date;
  events: TrackingEvent[];
  lastUpdated: Date;
}

export class TrackingService {
  private static trackingData: Map<string, TrackingInfo> = new Map();

  static generateTrackingNumber(orderId: string): string {
    return `TRK${orderId.toUpperCase()}`;
  }

  static createTrackingInfo(orderId: string, carrier: string = 'Mot-Lee Logistics'): TrackingInfo {
    const trackingNumber = this.generateTrackingNumber(orderId);
    const now = new Date();
    const estimatedDelivery = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now

    const trackingInfo: TrackingInfo = {
      trackingNumber,
      carrier,
      status: 'pending',
      estimatedDelivery,
      events: [
        {
          id: '1',
          timestamp: now,
          status: 'Order Placed',
          location: 'Mot-Lee Organics Warehouse',
          description: 'Your order has been received and is being prepared for shipment.',
          details: 'Order processing initiated'
        }
      ],
      lastUpdated: now
    };

    this.trackingData.set(trackingNumber, trackingInfo);
    return trackingInfo;
  }

  static getTrackingInfo(trackingNumber: string): TrackingInfo | null {
    return this.trackingData.get(trackingNumber) || null;
  }

  static updateTrackingStatus(trackingNumber: string, newStatus: TrackingInfo['status'], location: string, description: string): boolean {
    const trackingInfo = this.trackingData.get(trackingNumber);
    if (!trackingInfo) return false;

    const now = new Date();
    const eventId = (trackingInfo.events.length + 1).toString();

    const newEvent: TrackingEvent = {
      id: eventId,
      timestamp: now,
      status: this.getStatusDisplayName(newStatus),
      location,
      description,
      details: `Status updated to ${this.getStatusDisplayName(newStatus)}`
    };

    trackingInfo.status = newStatus;
    trackingInfo.events.push(newEvent);
    trackingInfo.lastUpdated = now;

    // Update estimated delivery based on status
    if (newStatus === 'in_transit') {
      trackingInfo.estimatedDelivery = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    } else if (newStatus === 'out_for_delivery') {
      trackingInfo.estimatedDelivery = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours
    }

    this.trackingData.set(trackingNumber, trackingInfo);
    return true;
  }

  static simulateTrackingUpdates(trackingNumber: string): void {
    const trackingInfo = this.trackingData.get(trackingNumber);
    if (!trackingInfo) return;

    const now = new Date();
    const timeSinceOrder = now.getTime() - trackingInfo.events[0].timestamp.getTime();
    const hoursSinceOrder = timeSinceOrder / (1000 * 60 * 60);

    // Simulate different tracking events based on time
    if (hoursSinceOrder > 2 && trackingInfo.status === 'pending') {
      this.updateTrackingStatus(trackingNumber, 'in_transit', 'Mot-Lee Organics Warehouse', 'Package picked up by carrier');
    } else if (hoursSinceOrder > 24 && trackingInfo.status === 'in_transit') {
      this.updateTrackingStatus(trackingNumber, 'in_transit', 'Cape Town Distribution Center', 'Package in transit to destination');
    } else if (hoursSinceOrder > 48 && trackingInfo.status === 'in_transit') {
      this.updateTrackingStatus(trackingNumber, 'out_for_delivery', 'Local Delivery Hub', 'Package out for delivery');
    } else if (hoursSinceOrder > 50 && trackingInfo.status === 'out_for_delivery') {
      this.updateTrackingStatus(trackingNumber, 'delivered', 'Customer Address', 'Package delivered successfully');
    }
  }

  private static getStatusDisplayName(status: TrackingInfo['status']): string {
    const statusMap: Record<TrackingInfo['status'], string> = {
      pending: 'Order Placed',
      in_transit: 'In Transit',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      exception: 'Exception'
    };
    return statusMap[status] || status;
  }

  static getTrackingStatusColor(status: TrackingInfo['status']): string {
    const colorMap: Record<TrackingInfo['status'], string> = {
      pending: 'text-yellow-600',
      in_transit: 'text-blue-600',
      out_for_delivery: 'text-purple-600',
      delivered: 'text-green-600',
      exception: 'text-red-600'
    };
    return colorMap[status] || 'text-gray-600';
  }

  static getTrackingStatusIcon(status: TrackingInfo['status']): string {
    const iconMap: Record<TrackingInfo['status'], string> = {
      pending: '📦',
      in_transit: '🚚',
      out_for_delivery: '🏃',
      delivered: '✅',
      exception: '⚠️'
    };
    return iconMap[status] || '📦';
  }

  static formatTrackingEvents(events: TrackingEvent[]): TrackingEvent[] {
    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}
