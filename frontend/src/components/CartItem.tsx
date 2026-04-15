import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

interface CartItemProps {
  item: {
    productId: string;
    quantity: number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  // ✅ FIX: convert BOTH to number before comparing
  const product = products.find(
    p => Number(p.id) === Number(item.productId)
  );

  // ✅ SAFE fallback
  if (!product) {
    return (
      <div className="p-4 text-red-500">
        Product not found (ID: {item.productId})
      </div>
    );
  }

  const { name, price, image } = product;

  return (
    <div className="flex items-center py-6 border-b border-gray-100 last:border-0">
      
      {/* IMAGE */}
      <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* DETAILS */}
      <div className="ml-6 flex-1">
        
        {/* NAME + DELETE */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-bold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              ${price.toFixed(2)}
            </p>
          </div>

          <button
            onClick={() => removeFromCart(item.productId)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* QUANTITY + TOTAL */}
        <div className="flex justify-between items-center mt-4">
          
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => updateQuantity(item.productId, -1)}
              className="p-2 hover:bg-gray-50"
            >
              <Minus size={14} />
            </button>

            <span className="px-4 text-sm font-medium">
              {item.quantity}
            </span>

            <button
              onClick={() => updateQuantity(item.productId, 1)}
              className="p-2 hover:bg-gray-50"
            >
              <Plus size={14} />
            </button>
          </div>

          <p className="text-base font-bold text-gray-900">
            ${(price * item.quantity).toFixed(2)}
          </p>
        </div>

      </div>
    </div>
  );
};

export default CartItem;