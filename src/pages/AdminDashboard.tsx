import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { Package, ShoppingBag, Users, DollarSign, AlertTriangle, Eye, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Product, Order, Customer } from '@/contexts/AppContext';
import { InventoryManagement } from '@/components/InventoryManagement';
import { OrderDetailsModal } from '@/components/OrderDetailsModal';

export const AdminDashboard = () => {
  const { user, products, orders, customers, updateOrderStatus, addProduct, updateProduct, deleteProduct } = useApp();
  const navigate = useNavigate();

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Oils' as Product['category'],
    stock: 0,
    rating: 4.5,
    reviews: 0,
    image: '/placeholder.svg',
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    sku: '',
    cost: 0,
    minStock: 5,
    maxStock: 100,
    tags: [] as string[],
    isActive: true,
  });

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const lowStockProducts = products.filter(p => p.stock < 10);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({ ...newProduct });
    toast.success('Product added successfully');
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      category: 'Oils',
      stock: 0,
      rating: 4.5,
      reviews: 0,
      image: '/placeholder.svg',
      weight: 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
      },
      sku: '',
      cost: 0,
      minStock: 5,
      maxStock: 100,
      tags: [],
      isActive: true,
    });
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, editingProduct);
      toast.success('Product updated successfully');
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      toast.success('Product deleted');
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: any) => {
    updateOrderStatus(orderId, status);
    toast.success('Order status updated');
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setSelectedOrder(null);
    setIsOrderModalOpen(false);
  };

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

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = orderSearchQuery === '' || 
      order.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.shippingAddress.name.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.shippingAddress.email?.toLowerCase().includes(orderSearchQuery.toLowerCase());
    
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const selectedCustomer = selectedOrder ? customers.find(c => c.id === selectedOrder.userId) : null;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 max-w-3xl overflow-x-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="products" className="text-xs sm:text-sm">Products</TabsTrigger>
          <TabsTrigger value="orders" className="text-xs sm:text-sm">Orders</TabsTrigger>
          <TabsTrigger value="customers" className="text-xs sm:text-sm">Customers</TabsTrigger>
          <TabsTrigger value="inventory" className="text-xs sm:text-sm">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R{totalSales.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customers.length}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Popular Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">R{product.price}</p>
                      <p className="text-sm text-muted-foreground">{product.reviews} reviews</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      required
                      value={editingProduct ? editingProduct.name : newProduct.name}
                      onChange={(e) =>
                        editingProduct
                          ? setEditingProduct({ ...editingProduct, name: e.target.value })
                          : setNewProduct({ ...newProduct, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      required
                      value={editingProduct ? editingProduct.description : newProduct.description}
                      onChange={(e) =>
                        editingProduct
                          ? setEditingProduct({ ...editingProduct, description: e.target.value })
                          : setNewProduct({ ...newProduct, description: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price (R)</Label>
                      <Input
                        id="price"
                        type="number"
                        required
                        value={editingProduct ? editingProduct.price : newProduct.price}
                        onChange={(e) =>
                          editingProduct
                            ? setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                            : setNewProduct({ ...newProduct, price: Number(e.target.value) })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        required
                        value={editingProduct ? editingProduct.stock : newProduct.stock}
                        onChange={(e) =>
                          editingProduct
                            ? setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                            : setNewProduct({ ...newProduct, stock: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={editingProduct ? editingProduct.category : newProduct.category}
                      onValueChange={(value: Product['category']) =>
                        editingProduct
                          ? setEditingProduct({ ...editingProduct, category: value })
                          : setNewProduct({ ...newProduct, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oils">Oils</SelectItem>
                        <SelectItem value="Scrubs">Scrubs</SelectItem>
                        <SelectItem value="Soaps">Soaps</SelectItem>
                        <SelectItem value="Lotions">Lotions</SelectItem>
                        <SelectItem value="Teas">Teas</SelectItem>
                        <SelectItem value="Supplements">Supplements</SelectItem>
                        <SelectItem value="Creams">Creams</SelectItem>
                        <SelectItem value="Combos">Combos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={editingProduct ? editingProduct.image : newProduct.image}
                      onChange={(e) =>
                        editingProduct
                          ? setEditingProduct({ ...editingProduct, image: e.target.value })
                          : setNewProduct({ ...newProduct, image: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weight">Weight (grams)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={editingProduct ? editingProduct.weight : newProduct.weight}
                        onChange={(e) =>
                          editingProduct
                            ? setEditingProduct({ ...editingProduct, weight: Number(e.target.value) })
                            : setNewProduct({ ...newProduct, weight: Number(e.target.value) })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        placeholder="e.g., MOT-001"
                        value={editingProduct ? editingProduct.sku : newProduct.sku}
                        onChange={(e) =>
                          editingProduct
                            ? setEditingProduct({ ...editingProduct, sku: e.target.value })
                            : setNewProduct({ ...newProduct, sku: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Dimensions (cm)</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label htmlFor="length" className="text-xs">Length</Label>
                        <Input
                          id="length"
                          type="number"
                          placeholder="10"
                          value={editingProduct ? editingProduct.dimensions.length : newProduct.dimensions.length}
                          onChange={(e) =>
                            editingProduct
                              ? setEditingProduct({ 
                                  ...editingProduct, 
                                  dimensions: { ...editingProduct.dimensions, length: Number(e.target.value) }
                                })
                              : setNewProduct({ 
                                  ...newProduct, 
                                  dimensions: { ...newProduct.dimensions, length: Number(e.target.value) }
                                })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="width" className="text-xs">Width</Label>
                        <Input
                          id="width"
                          type="number"
                          placeholder="8"
                          value={editingProduct ? editingProduct.dimensions.width : newProduct.dimensions.width}
                          onChange={(e) =>
                            editingProduct
                              ? setEditingProduct({ 
                                  ...editingProduct, 
                                  dimensions: { ...editingProduct.dimensions, width: Number(e.target.value) }
                                })
                              : setNewProduct({ 
                                  ...newProduct, 
                                  dimensions: { ...newProduct.dimensions, width: Number(e.target.value) }
                                })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="height" className="text-xs">Height</Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="5"
                          value={editingProduct ? editingProduct.dimensions.height : newProduct.dimensions.height}
                          onChange={(e) =>
                            editingProduct
                              ? setEditingProduct({ 
                                  ...editingProduct, 
                                  dimensions: { ...editingProduct.dimensions, height: Number(e.target.value) }
                                })
                              : setNewProduct({ 
                                  ...newProduct, 
                                  dimensions: { ...newProduct.dimensions, height: Number(e.target.value) }
                                })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cost">Cost Price (R)</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      value={editingProduct ? editingProduct.cost : newProduct.cost}
                      onChange={(e) =>
                        editingProduct
                          ? setEditingProduct({ ...editingProduct, cost: Number(e.target.value) })
                          : setNewProduct({ ...newProduct, cost: Number(e.target.value) })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minStock">Min Stock Level</Label>
                      <Input
                        id="minStock"
                        type="number"
                        value={editingProduct ? editingProduct.minStock : newProduct.minStock}
                        onChange={(e) =>
                          editingProduct
                            ? setEditingProduct({ ...editingProduct, minStock: Number(e.target.value) })
                            : setNewProduct({ ...newProduct, minStock: Number(e.target.value) })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="maxStock">Max Stock Level</Label>
                      <Input
                        id="maxStock"
                        type="number"
                        value={editingProduct ? editingProduct.maxStock : newProduct.maxStock}
                        onChange={(e) =>
                          editingProduct
                            ? setEditingProduct({ ...editingProduct, maxStock: Number(e.target.value) })
                            : setNewProduct({ ...newProduct, maxStock: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      placeholder="organic, skincare, natural, cruelty-free"
                      value={editingProduct ? editingProduct.tags.join(', ') : newProduct.tags.join(', ')}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                        editingProduct
                          ? setEditingProduct({ ...editingProduct, tags })
                          : setNewProduct({ ...newProduct, tags });
                      }}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={editingProduct ? editingProduct.isActive : newProduct.isActive}
                      onChange={(e) =>
                        editingProduct
                          ? setEditingProduct({ ...editingProduct, isActive: e.target.checked })
                          : setNewProduct({ ...newProduct, isActive: e.target.checked })
                      }
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="isActive">Product is active (visible to customers)</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                    {editingProduct && (
                      <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{product.name}</h4>
                            {!product.isActive && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Inactive</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{product.category} • SKU: {product.sku || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">R{product.price}</p>
                          <p className="text-xs text-muted-foreground">Cost: R{product.cost || 0}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                        <div>
                          <span className="font-medium">Stock:</span> {product.stock} 
                          {product.stock <= product.minStock && (
                            <span className="text-red-600 font-medium"> (LOW!)</span>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">Weight:</span> {product.weight}g
                        </div>
                        <div>
                          <span className="font-medium">Dimensions:</span> {product.dimensions.length}×{product.dimensions.width}×{product.dimensions.height}cm
                        </div>
                        <div>
                          <span className="font-medium">Rating:</span> {product.rating} ({product.reviews} reviews)
                        </div>
                      </div>

                      {product.tags && product.tags.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {product.tags.map((tag, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingProduct(product)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
                
                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search orders..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="pl-9 w-full sm:w-[250px]"
                    />
                  </div>
                  
                  <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  {orders.length === 0 ? 'No orders yet' : 'No orders match your search criteria'}
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewOrder(order)}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-mono text-sm font-medium">#{order.id}</p>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.createdAt.toLocaleDateString()} at {order.createdAt.toLocaleTimeString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Customer: {order.shippingAddress.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewOrder(order);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1 mb-3">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Items ({order.items.length})</div>
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {item.name} x {item.quantity}
                            </span>
                            <span>R{item.price * item.quantity}</span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="text-sm text-muted-foreground">
                            +{order.items.length - 3} more items
                          </div>
                        )}
                      </div>

                      <div className="border-t pt-3 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-lg">R{order.total.toFixed(2)}</span>
                          {order.trackingNumber && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Tracking: {order.trackingNumber}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer List</CardTitle>
            </CardHeader>
            <CardContent>
              {customers.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No customers yet</p>
              ) : (
                <div className="space-y-3">
                  {customers.map((customer) => {
                    const customerOrders = orders.filter(o => o.userId === customer.id);
                    return (
                      <div key={customer.id} className="border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div>
                            <h4 className="font-semibold">{customer.name}</h4>
                            <p className="text-sm text-muted-foreground break-all">{customer.email}</p>
                          </div>
                          <div className="sm:text-right">
                            <p className="font-medium">{customerOrders.length} orders</p>
                            <p className="text-sm text-muted-foreground">
                              R
                              {customerOrders
                                .reduce((sum, order) => sum + order.total, 0)
                                .toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="mt-6">
          <InventoryManagement />
        </TabsContent>
      </Tabs>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        customer={selectedCustomer}
        isOpen={isOrderModalOpen}
        onClose={handleCloseOrderModal}
        onUpdateStatus={handleUpdateOrderStatus}
      />
    </div>
  );
};
