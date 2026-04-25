import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../lib/apiService';
import { toast } from 'react-toastify';


interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

const Order: React.FC = () => {
  const navigate = useNavigate();
  
  // Get cart from localStorage (you can also pass via props/context)
  const [cart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    country: 'Ethiopia',
  });

  const [cardData, setCardData] = useState({
    cardType: 'visa',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const [loading, setLoading] = useState(false);


  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);


    if (cart.length === 0) {
      toast.error('Your cart is empty');
      setLoading(false);
      return;
    }


    try {
      const orderData = {
  items: cart.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.price,
  })),
  totalPrice: totalPrice,
  shippingInfo: formData,
  paymentInfo: {
    cardType: cardData.cardType,
    cardNumber: cardData.cardNumber,   // only for demo
    cardHolder: cardData.cardHolder,
  }
};

      const token = localStorage.getItem('token'); // Assuming you store JWT

      const res = await axios.post(
        apiUrl('/orders'),
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Clear cart after successful order
      localStorage.removeItem('cart');
 
      toast.success('Order placed successfully! 🎉');
      navigate('/orders'); // or wherever you want to redirect


    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {

      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-emerald-500 text-black px-8 py-3 rounded-2xl font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center">Checkout</h1>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Shipping Information */}
          <div className="md:col-span-3">
            <div className="bg-zinc-900 rounded-3xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleShippingChange}
                    required
                    className="w-full bg-black border border-zinc-700 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none"
                    placeholder="Feysel Yassin"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleShippingChange}
                      required
                      className="w-full bg-black border border-zinc-700 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none"
                      placeholder="+251 9XX XXX XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleShippingChange}
                      required
                      className="w-full bg-black border border-zinc-700 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Full Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleShippingChange}
                    required
                    className="w-full bg-black border border-zinc-700 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none"
                    placeholder="Street, City, Subcity"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleShippingChange}
                    className="w-full bg-black border border-zinc-700 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none"
                  >
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Somalia">Somalia</option>
                    <option value="Sudan">Sudan</option>
                  </select>
                </div>

                {/* Payment Section */}
                <div className="pt-8 border-t border-zinc-800">
                  <h2 className="text-2xl font-semibold mb-6">Payment Details</h2>

                  <div className="mb-6">
                    <label className="block text-sm mb-3">Select Card Type</label>
                    <div className="flex gap-4">
                      {['visa', 'mastercard', 'amex'].map((type) => (
                        <label
                          key={type}
                          className={`flex-1 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            cardData.cardType === type
                              ? 'border-emerald-500 bg-emerald-950'
                              : 'border-zinc-700 hover:border-zinc-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name="cardType"
                            value={type}
                            checked={cardData.cardType === type}
                            onChange={handleCardChange}
                            className="hidden"
                          />
                          <div className="text-center capitalize font-medium">
                            {type === 'amex' ? 'American Express' : type}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm mb-2">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleCardChange}
                        maxLength={19}
                        placeholder="4242 4242 4242 4242"
                        required
                        className="w-full bg-black border border-zinc-700 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm mb-2">Card Holder Name</label>
                        <input
                          type="text"
                          name="cardHolder"
                          value={cardData.cardHolder}
                          onChange={handleCardChange}
                          placeholder="Feysel Yassin"
                          required
                          className="w-full bg-black border border-zinc-700 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-2">Expiry Date</label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={cardData.expiryDate}
                            onChange={handleCardChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            required
                            className="w-full bg-black border border-zinc-700 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-2">CVV</label>
                          <input
                            type="password"
                            name="cvv"
                            value={cardData.cvv}
                            onChange={handleCardChange}
                            maxLength={4}
                            placeholder="123"
                            required
                            className="w-full bg-black border border-zinc-700 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>



                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-8 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-700 text-black font-bold text-xl py-6 rounded-3xl transition-all flex items-center justify-center gap-3"
                >
                  {loading ? 'Processing Payment...' : `Pay $${totalPrice.toFixed(2)} & Place Order`}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-2">
            <div className="bg-zinc-900 rounded-3xl p-8 sticky top-8">
              <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-6">
                {cart.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-16 h-16 bg-zinc-800 rounded-xl overflow-hidden">
                      {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-zinc-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-700 my-8"></div>

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <p className="text-xs text-zinc-500 mt-8 text-center">
                Your order will be processed securely.<br />
                This is a demo — no real payment is taken.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
