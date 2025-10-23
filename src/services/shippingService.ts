export interface ShippingZone {
  name: string;
  provinces: string[];
  baseRate: number; // Base rate in ZAR
  perKgRate: number; // Additional rate per kg in ZAR
  freeShippingThreshold: number; // Minimum order value for free shipping
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  estimatedDays: string;
  price: number;
  isFree: boolean;
}

// Define shipping zones for South Africa
export const shippingZones: ShippingZone[] = [
  {
    name: 'Western Cape',
    provinces: ['Western Cape'],
    baseRate: 50,
    perKgRate: 15,
    freeShippingThreshold: 500
  },
  {
    name: 'Gauteng',
    provinces: ['Gauteng'],
    baseRate: 60,
    perKgRate: 18,
    freeShippingThreshold: 600
  },
  {
    name: 'KwaZulu-Natal',
    provinces: ['KwaZulu-Natal'],
    baseRate: 70,
    perKgRate: 20,
    freeShippingThreshold: 700
  },
  {
    name: 'Other Provinces',
    provinces: ['Eastern Cape', 'Free State', 'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West'],
    baseRate: 80,
    perKgRate: 25,
    freeShippingThreshold: 800
  }
];

export interface CartItem {
  id: string;
  name: string;
  weight: number; // in grams
  quantity: number;
  price: number;
}

export class ShippingService {
  static calculateShipping(
    items: CartItem[],
    province: string,
    subtotal: number
  ): ShippingOption[] {
    const zone = this.getShippingZone(province);
    if (!zone) {
      return [];
    }

    // Calculate total weight in kg
    const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0) / 1000;
    
    // Calculate base shipping cost
    const baseCost = zone.baseRate + (totalWeight * zone.perKgRate);
    
    // Check if eligible for free shipping
    const isFreeShipping = subtotal >= zone.freeShippingThreshold;
    
    const options: ShippingOption[] = [
      {
        id: 'standard',
        name: 'Standard Shipping',
        description: `Delivery to ${zone.name}`,
        estimatedDays: '3-5 business days',
        price: isFreeShipping ? 0 : baseCost,
        isFree: isFreeShipping
      },
      {
        id: 'express',
        name: 'Express Shipping',
        description: `Fast delivery to ${zone.name}`,
        estimatedDays: '1-2 business days',
        price: isFreeShipping ? 0 : Math.round(baseCost * 1.5),
        isFree: isFreeShipping
      }
    ];

    // Add overnight option for major cities
    if (['Western Cape', 'Gauteng', 'KwaZulu-Natal'].includes(zone.name)) {
      options.push({
        id: 'overnight',
        name: 'Overnight Delivery',
        description: `Next day delivery to ${zone.name}`,
        estimatedDays: '1 business day',
        price: isFreeShipping ? 0 : Math.round(baseCost * 2),
        isFree: isFreeShipping
      });
    }

    return options;
  }

  static getShippingZone(province: string): ShippingZone | null {
    return shippingZones.find(zone => 
      zone.provinces.some(p => p.toLowerCase() === province.toLowerCase())
    ) || shippingZones[shippingZones.length - 1]; // Default to "Other Provinces"
  }

  static getEstimatedDeliveryDate(estimatedDays: string): Date {
    const days = parseInt(estimatedDays.split('-')[0]);
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);
    
    // Skip weekends
    while (deliveryDate.getDay() === 0 || deliveryDate.getDay() === 6) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
    }
    
    return deliveryDate;
  }

  static formatShippingOption(option: ShippingOption): string {
    if (option.isFree) {
      return `FREE - ${option.name} (${option.estimatedDays})`;
    }
    return `R${option.price.toFixed(2)} - ${option.name} (${option.estimatedDays})`;
  }
}
