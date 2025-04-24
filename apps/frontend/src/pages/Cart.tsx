
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CartItem from "@/components/CartItem";
import Layout from "@/components/Layout";
import { Product } from "@/components/ProductCard";
import { ShoppingBag } from "lucide-react";

// Mock cart items for demonstration
const initialCartItems = [
  {
    product: {
      id: "1",
      name: "Wireless Earbuds",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=500&q=60",
      description: "High quality wireless earbuds with noise cancellation."
    },
    quantity: 1
  },
  {
    product: {
      id: "2",
      name: "Smart Watch",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=500&q=60",
      description: "Latest generation smart watch with health monitoring."
    },
    quantity: 2
  }
];

const Cart = () => {
  const [cartItems, setCartItems] = useState<Array<{ product: Product; quantity: number }>>(initialCartItems);
  const [isLoading, setIsLoading] = useState(false);

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.product.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.product.id !== id));
  };

  const handleCheckout = () => {
    setIsLoading(true);
    
    // Create a WhatsApp message with cart details
    const items = cartItems.map(item => 
      `${item.quantity}x ${item.product.name} - $${(item.product.price * item.quantity).toFixed(2)}`
    ).join("\n");
    
    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity, 
      0
    ).toFixed(2);
    
    const message = `Hello! I would like to place an order:\n\n${items}\n\nTotal: $${total}`;
    const encodedMessage = encodeURIComponent(message);
    
    // Replace with your actual WhatsApp business number
    window.open(`https://wa.me/your-whatsapp-number?text=${encodedMessage}`, '_blank');
    
    setIsLoading(false);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h3>
                <p className="text-gray-500 mb-4">Looks like you haven't added anything to your cart yet.</p>
                <Button asChild>
                  <a href="/">Continue Shopping</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.product.id}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeItem}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping</span>
                      <span>To be determined</span>
                    </div>
                    <div className="border-t border-gray-200 my-4"></div>
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleCheckout} 
                    disabled={isLoading} 
                    className="w-full"
                  >
                    {isLoading ? "Processing..." : "Checkout via WhatsApp"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
