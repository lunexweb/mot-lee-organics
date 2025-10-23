export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailData {
  to: string;
  template: EmailTemplate;
  data?: Record<string, any>;
}

export class EmailService {
  private static isEnabled = true; // In production, this would be controlled by environment variables

  static async sendEmail(emailData: EmailData): Promise<boolean> {
    if (!this.isEnabled) {
      console.log('Email service disabled. Would send:', emailData);
      return true;
    }

    try {
      // In a real application, this would integrate with an email service like SendGrid, AWS SES, etc.
      console.log('📧 Email sent:', {
        to: emailData.to,
        subject: emailData.template.subject,
        data: emailData.data
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  static generateOrderConfirmationTemplate(orderData: any): EmailTemplate {
    const { order, customer } = orderData;
    
    return {
      subject: `Order Confirmation - #${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Order Confirmation</h2>
          <p>Dear ${customer.name},</p>
          <p>Thank you for your order! We've received your order and it's being processed.</p>
          
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> #${order.id}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3>Items Ordered</h3>
            ${order.items.map((item: any) => `
              <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <p><strong>${item.name}</strong> x ${item.quantity}</p>
                <p>R${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            `).join('')}
          </div>
          
          <div style="background: #f9f9f9; padding: 15px; margin: 20px 0;">
            <p><strong>Subtotal:</strong> R${order.subtotal.toFixed(2)}</p>
            ${order.discount > 0 ? `<p><strong>Discount:</strong> -R${order.discount.toFixed(2)}</p>` : ''}
            <p><strong>Shipping:</strong> R${order.shipping.toFixed(2)}</p>
            <p><strong>Total:</strong> R${order.total.toFixed(2)}</p>
          </div>
          
          <p>We'll send you another email when your order ships.</p>
          <p>Thank you for choosing Mot-Lee Organics!</p>
        </div>
      `,
      text: `
        Order Confirmation - #${order.id}
        
        Dear ${customer.name},
        
        Thank you for your order! We've received your order and it's being processed.
        
        Order Details:
        - Order Number: #${order.id}
        - Order Date: ${new Date(order.createdAt).toLocaleDateString()}
        - Status: ${order.status}
        
        Items Ordered:
        ${order.items.map((item: any) => `- ${item.name} x ${item.quantity} - R${(item.price * item.quantity).toFixed(2)}`).join('\n')}
        
        Subtotal: R${order.subtotal.toFixed(2)}
        ${order.discount > 0 ? `Discount: -R${order.discount.toFixed(2)}` : ''}
        Shipping: R${order.shipping.toFixed(2)}
        Total: R${order.total.toFixed(2)}
        
        We'll send you another email when your order ships.
        Thank you for choosing Mot-Lee Organics!
      `
    };
  }

  static generateOrderStatusUpdateTemplate(orderData: any): EmailTemplate {
    const { order, customer, newStatus } = orderData;
    
    const statusMessages: Record<string, string> = {
      processing: 'Your order is being prepared for shipment.',
      shipped: 'Your order has been shipped and is on its way!',
      delivered: 'Your order has been delivered successfully.',
      cancelled: 'Your order has been cancelled.'
    };

    return {
      subject: `Order Update - #${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Order Update</h2>
          <p>Dear ${customer.name},</p>
          <p>Your order #${order.id} status has been updated to <strong>${newStatus}</strong>.</p>
          <p>${statusMessages[newStatus] || 'Your order status has been updated.'}</p>
          
          ${newStatus === 'shipped' ? `
            <div style="background: #e8f5e8; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p><strong>Tracking Information:</strong></p>
              <p>Your package is on its way! You can track your shipment using the tracking number: <strong>TRK${order.id}</strong></p>
            </div>
          ` : ''}
          
          <p>Thank you for choosing Mot-Lee Organics!</p>
        </div>
      `,
      text: `
        Order Update - #${order.id}
        
        Dear ${customer.name},
        
        Your order #${order.id} status has been updated to ${newStatus}.
        ${statusMessages[newStatus] || 'Your order status has been updated.'}
        
        ${newStatus === 'shipped' ? `
        Tracking Information:
        Your package is on its way! You can track your shipment using the tracking number: TRK${order.id}
        ` : ''}
        
        Thank you for choosing Mot-Lee Organics!
      `
    };
  }

  static generateWelcomeEmailTemplate(customerData: any): EmailTemplate {
    const { customer } = customerData;
    
    return {
      subject: 'Welcome to Mot-Lee Organics!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Mot-Lee Organics!</h2>
          <p>Dear ${customer.name},</p>
          <p>Welcome to our family! We're thrilled to have you join us on your journey to natural, organic skincare.</p>
          
          <div style="background: #f0f8ff; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3>Get Started</h3>
            <p>As a new member, you can enjoy:</p>
            <ul>
              <li>10% off your first order (use code: WELCOME10)</li>
              <li>Free shipping on orders over R500</li>
              <li>Exclusive access to new products</li>
              <li>Expert skincare advice</li>
            </ul>
          </div>
          
          <p>Browse our collection of premium organic products and start your skincare journey today!</p>
          <p>If you have any questions, don't hesitate to reach out to our customer service team.</p>
          <p>Welcome aboard!</p>
          <p>The Mot-Lee Organics Team</p>
        </div>
      `,
      text: `
        Welcome to Mot-Lee Organics!
        
        Dear ${customer.name},
        
        Welcome to our family! We're thrilled to have you join us on your journey to natural, organic skincare.
        
        Get Started:
        As a new member, you can enjoy:
        - 10% off your first order (use code: WELCOME10)
        - Free shipping on orders over R500
        - Exclusive access to new products
        - Expert skincare advice
        
        Browse our collection of premium organic products and start your skincare journey today!
        If you have any questions, don't hesitate to reach out to our customer service team.
        
        Welcome aboard!
        The Mot-Lee Organics Team
      `
    };
  }

  static generateLowStockAlertTemplate(alertData: any): EmailTemplate {
    const { products } = alertData;
    
    return {
      subject: 'Low Stock Alert - Action Required',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6b35;">Low Stock Alert</h2>
          <p>The following products are running low on stock and may need restocking:</p>
          
          <div style="background: #fff3cd; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3>Products Requiring Attention</h3>
            ${products.map((product: any) => `
              <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <p><strong>${product.name}</strong></p>
                <p>Current Stock: ${product.currentStock} | Minimum Required: ${product.minStock}</p>
              </div>
            `).join('')}
          </div>
          
          <p>Please review your inventory and consider restocking these items to avoid stockouts.</p>
        </div>
      `,
      text: `
        Low Stock Alert
        
        The following products are running low on stock and may need restocking:
        
        Products Requiring Attention:
        ${products.map((product: any) => `
        - ${product.name}
          Current Stock: ${product.currentStock} | Minimum Required: ${product.minStock}
        `).join('')}
        
        Please review your inventory and consider restocking these items to avoid stockouts.
      `
    };
  }
}
