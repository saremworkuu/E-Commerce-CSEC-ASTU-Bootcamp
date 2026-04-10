import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center py-6 border-b border-gray-100 last:border-0">
      {/* Image */}
      <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Details */}
      <div className="ml-6 flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-bold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-500 mt-1">${item.price.toFixed(2)}</p>
          </div>
          <button 
            onClick={() => removeFromCart(item.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button 
              onClick={() => updateQuantity(item.id, -1)}
              className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="px-4 text-sm font-medium text-gray-900">{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, 1)}
              className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <p className="text-base font-bold text-gray-900">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
