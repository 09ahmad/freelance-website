
import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/components/ProductCard";

// Sample data - would come from an API in a real application
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Earbuds",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=500&q=60",
    description: "High quality wireless earbuds with noise cancellation."
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=500&q=60",
    description: "Latest generation smart watch with health monitoring."
  },
  {
    id: "3",
    name: "Bluetooth Speaker",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=500&q=60",
    description: "Portable bluetooth speaker with 20h battery life."
  },
  {
    id: "4",
    name: "Leather Wallet",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&w=500&q=60",
    description: "Genuine leather wallet with RFID protection."
  },
  {
    id: "5",
    name: "Pet Grooming Kit",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=500&q=60",
    description: "Complete grooming kit for cats and dogs."
  },
];

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(), // Generate a unique ID
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, ...updatedFields } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const getProduct = (id: string) => {
    return products.find((product) => product.id === id);
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, getProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
