import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Package, TrendingUp, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export const InventoryManagement = () => {
  const { 
    products, 
    stockMovements, 
    adjustStock, 
    restockProduct, 
    getLowStockProducts, 
    getStockMovements, 
    getInventoryValue,
    getLowStockAlerts 
  } = useApp();
  
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [adjustQuantity, setAdjustQuantity] = useState<string>('');
  const [adjustReason, setAdjustReason] = useState<string>('');
  const [restockQuantity, setRestockQuantity] = useState<string>('');
  const [restockCost, setRestockCost] = useState<string>('');

  const lowStockProducts = getLowStockProducts();
  const lowStockAlerts = getLowStockAlerts();
  const inventoryValue = getInventoryValue();

  const handleAdjustStock = () => {
    if (!selectedProduct || !adjustQuantity || !adjustReason) {
      toast.error('Please fill in all fields');
      return;
    }

    const quantity = parseInt(adjustQuantity);
    if (isNaN(quantity)) {
      toast.error('Please enter a valid quantity');
      return;
    }

    adjustStock(selectedProduct, quantity, adjustReason);
    setAdjustQuantity('');
    setAdjustReason('');
  };

  const handleRestock = () => {
    if (!selectedProduct || !restockQuantity || !restockCost) {
      toast.error('Please fill in all fields');
      return;
    }

    const quantity = parseInt(restockQuantity);
    const cost = parseFloat(restockCost);
    
    if (isNaN(quantity) || isNaN(cost)) {
      toast.error('Please enter valid numbers');
      return;
    }

    restockProduct(selectedProduct, quantity, cost);
    setRestockQuantity('');
    setRestockCost('');
  };

  const selectedProductData = products.find(p => p.id === selectedProduct);

  return (
    <div className="space-y-6">
      {/* Inventory Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold text-orange-600">{lowStockProducts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
                <p className="text-2xl font-bold">R{inventoryValue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {lowStockAlerts.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Low Stock Alert:</strong> {lowStockAlerts.length} product(s) are running low on stock.
            {lowStockAlerts.map(alert => (
              <div key={alert.product.id} className="mt-1">
                {alert.product.name}: {alert.currentStock} remaining (min: {alert.minStock})
              </div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="adjust" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="adjust">Adjust Stock</TabsTrigger>
          <TabsTrigger value="restock">Restock</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
        </TabsList>

        <TabsContent value="adjust" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Adjust Stock</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="product-select">Select Product</Label>
                <select
                  id="product-select"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Choose a product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Current: {product.stock})
                    </option>
                  ))}
                </select>
              </div>

              {selectedProductData && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium">{selectedProductData.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Current Stock: {selectedProductData.stock} | 
                    Min Stock: {selectedProductData.minStock} | 
                    Max Stock: {selectedProductData.maxStock}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adjust-quantity">Quantity Change</Label>
                  <Input
                    id="adjust-quantity"
                    type="number"
                    value={adjustQuantity}
                    onChange={(e) => setAdjustQuantity(e.target.value)}
                    placeholder="Enter positive or negative number"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use positive numbers to increase stock, negative to decrease
                  </p>
                </div>

                <div>
                  <Label htmlFor="adjust-reason">Reason</Label>
                  <Input
                    id="adjust-reason"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    placeholder="e.g., Damaged goods, Found stock"
                  />
                </div>
              </div>

              <Button onClick={handleAdjustStock} disabled={!selectedProduct || !adjustQuantity || !adjustReason}>
                Adjust Stock
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Restock Product</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="restock-product">Select Product</Label>
                <select
                  id="restock-product"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Choose a product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Current: {product.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="restock-quantity">Quantity</Label>
                  <Input
                    id="restock-quantity"
                    type="number"
                    value={restockQuantity}
                    onChange={(e) => setRestockQuantity(e.target.value)}
                    placeholder="Enter quantity to add"
                  />
                </div>

                <div>
                  <Label htmlFor="restock-cost">Cost per Unit (R)</Label>
                  <Input
                    id="restock-cost"
                    type="number"
                    step="0.01"
                    value={restockCost}
                    onChange={(e) => setRestockCost(e.target.value)}
                    placeholder="Enter cost per unit"
                  />
                </div>
              </div>

              <Button onClick={handleRestock} disabled={!selectedProduct || !restockQuantity || !restockCost}>
                Restock Product
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockMovements
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .slice(0, 20)
                    .map((movement) => {
                      const product = products.find(p => p.id === movement.productId);
                      return (
                        <TableRow key={movement.id}>
                          <TableCell>{product?.name || 'Unknown Product'}</TableCell>
                          <TableCell>
                            <Badge variant={movement.type === 'in' ? 'default' : movement.type === 'out' ? 'destructive' : 'secondary'}>
                              {movement.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{movement.quantity}</TableCell>
                          <TableCell>{movement.reason}</TableCell>
                          <TableCell>{new Date(movement.timestamp).toLocaleDateString()}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
