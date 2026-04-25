import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../data/products';

interface CartItemProps {
  item: Product & {
    quantity: number;
    productId?: any;
    imageUrl?: string;
    id?: string | number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const resolveItemId = () => {
    if (item.id) return String(item.id);
    if (item.productId) {
      return typeof item.productId === 'object'
        ? String(item.productId._id || item.productId.id || item.productId)
        : String(item.productId);
    }
    return '';
  };

  const itemId = resolveItemId();

  if (!itemId) {
    return null;
  }

  return (
    <div className="flex items-center py-6 border-b border-gray-100 dark:border-neutral-800 last:border-0">
      {/* Image */}
      <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800">
        <img 
          src={item.imageUrl || item.image} 
          alt={item.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Details */}
      <div className="ml-6 flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">{item.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">${item.price.toFixed(2)}</p>
          </div>
          <button 
            onClick={() => removeFromCart(itemId)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center border border-gray-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <button 
              onClick={() => updateQuantity(itemId, -1)}
              className="p-2 hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-400 transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="px-4 text-sm font-medium text-gray-900 dark:text-white">{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(itemId, 1)}
              className="p-2 hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-400 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <p className="text-base font-bold text-gray-900 dark:text-white">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
