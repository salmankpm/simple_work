import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { clearCart } from '../store/cartSlice';
import { MapPin, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';
import api from '../utils/api';

const Checkout = () => {
  const cart = useSelector(state => state.cart);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.address || '');
  const [loading, setLoading] = useState(false);

  const deliveryFee = 2.99;
  const taxes = cart.totalAmount * 0.08; // 8% tax
  const finalTotal = cart.totalAmount + deliveryFee + taxes;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }

    if (!address) {
      alert('Please enter a delivery address');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        restaurant: cart.restaurant._id,
        items: cart.items.map(item => ({
          menuItem: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: finalTotal,
        deliveryAddress: address,
        paymentId: 'mock_payment_' + Math.floor(Math.random() * 1000000)
      };

      const { data } = await api.post('/orders', orderData);
      dispatch(clearCart());
      navigate(`/order/${data._id}`);
    } catch (error) {
      console.error('Error placing order', error);
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ShoppingBag size={80} className="text-gray-200 mb-6" />
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b pb-4">
              <MapPin className="text-orange-500" /> Delivery Details
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Delivery Address</label>
              <textarea 
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                rows="3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter full delivery address..."
              ></textarea>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b pb-4">
              <CreditCard className="text-orange-500" /> Payment Method
            </h2>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center gap-4">
              <input type="radio" checked readOnly className="text-orange-500 focus:ring-orange-500" />
              <div>
                <p className="font-bold text-gray-900">Cash on Delivery / Mock Payment</p>
                <p className="text-sm text-gray-500">For demo purposes, payment is simulated.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-1/3">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-4 border-b pb-4">Order Summary</h2>
            <p className="text-gray-500 text-sm mb-4 font-medium">From: <span className="text-orange-500">{cart.restaurant?.name}</span></p>
            
            <div className="space-y-4 mb-6">
              {cart.items.map(item => (
                <div key={item._id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold">{item.quantity}x</span>
                    <span className="font-medium text-gray-800">{item.name}</span>
                  </div>
                  <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cart.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>${taxes.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-6">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-2xl text-orange-600">${finalTotal.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-full font-bold hover:bg-orange-600 transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (
                <>Place Order <ArrowRight size={18} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
