
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/components/ProductCard";

// This would come from an API in a real app
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Earbuds",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=500&q=60",
    description: "High quality wireless earbuds with noise cancellation. These earbuds feature active noise cancellation, water resistance, and up to 8 hours of battery life on a single charge."
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=500&q=60",
    description: "Latest generation smart watch with health monitoring. Track your heart rate, sleep patterns, and activity levels. Features a bright AMOLED display and 7-day battery life."
  },
  {
    id: "3",
    name: "Bluetooth Speaker",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=500&q=60",
    description: "Portable bluetooth speaker with 20h battery life. IPX7 waterproof rating makes it perfect for outdoor use. Delivers rich, immersive sound with deep bass."
  },
  {
    id: "4",
    name: "Leather Wallet",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&w=500&q=60",
    description: "Genuine leather wallet with RFID protection. Features 8 card slots, 2 cash compartments and a coin pocket. Made from premium full-grain leather."
  },
  {
    id: "5",
    name: "Pet Grooming Kit",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=500&q=60",
    description: "Complete grooming kit for cats and dogs. Contains stainless steel scissors, combs, nail clippers, and a deshedding tool. Perfect for maintaining your pet's coat at home."
  },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      const foundProduct = sampleProducts.find(p => p.id === id) || null;
      setProduct(foundProduct);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      // In a real app, this would update a cart context/state
      console.log(`Added ${quantity} of ${product.name} to cart`);
      
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} has been added to your cart.`,
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      // Create WhatsApp message with product details
      const message = `Hello! I'm interested in purchasing ${quantity} x ${product.name} (${product.price} each). Please provide more information.`;
      const encodedMessage = encodeURIComponent(message);
      
      // Replace with your actual WhatsApp business number
      window.open(`https://wa.me/your-whatsapp-number?text=${encodedMessage}`, '_blank');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse space-y-8 w-full max-w-4xl">
            <div className="h-72 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p>Sorry, we couldn't find the product you're looking for.</p>
          <Button asChild className="mt-6">
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-md">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-[400px] object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-2xl font-semibold text-brand-600">${product.price.toFixed(2)}</p>
            
            <div className="border-t border-b border-gray-200 py-4">
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <label htmlFor="quantity" className="mr-3 text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <select 
                  id="quantity" 
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleAddToCart} 
                variant="outline" 
                className="flex-1"
              >
                <ShoppingCart size={18} className="mr-2" />
                Add to Cart
              </Button>
              <Button 
                onClick={handleBuyNow} 
                className="flex-1"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Product Details</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="prose max-w-none">
              <p>
                {product.description}
              </p>
              <p className="mt-4">
                Our products come with a 30-day money-back guarantee. If you're not satisfied with your purchase, please contact our customer service team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
