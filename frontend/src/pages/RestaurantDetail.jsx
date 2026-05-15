import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Clock, Plus, Minus, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { addToCart, removeFromCart } from '../store/cartSlice';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const cartRestaurant = useSelector(state => state.cart.restaurant);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const { data } = await api.get(`/restaurants/${id}`);
        setRestaurant(data);
      } catch (err) {
        setError('Restaurant not found');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div></div>;
  if (error || !restaurant) return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;

  const handleAddToCart = (item) => {
    if (cartRestaurant && cartRestaurant._id !== restaurant._id) {
      if(window.confirm('You have items from another restaurant in your cart. Clear cart and add this item?')) {
        dispatch(addToCart({ item, restaurant }));
      }
    } else {
      dispatch(addToCart({ item, restaurant }));
    }
  };

  const getQuantity = (itemId) => {
    const item = cartItems.find(i => i._id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="pb-24">
      {/* Header Image */}
      <div className="h-64 md:h-80 w-full rounded-3xl overflow-hidden relative mb-8">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-lg opacity-90 mb-4">{restaurant.cuisine}</p>
          <div className="flex items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span>{restaurant.rating} Rating</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg">
              <Clock size={16} />
              <span>{restaurant.deliveryTime || '30-45 min'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Menu Section */}
        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Menu Highlights
          </h2>
          <div className="space-y-6">
            {restaurant.menu?.map((item, index) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={item._id} 
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 hover:shadow-md transition-shadow"
              >
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                )}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
                    
                    {getQuantity(item._id) === 0 ? (
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className="bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors px-4 py-1.5 rounded-full font-medium text-sm flex items-center gap-1"
                      >
                        <Plus size={16} /> Add
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
                        <button 
                          onClick={() => dispatch(removeFromCart(item._id))}
                          className="bg-white rounded-full p-1 shadow-sm text-orange-600 hover:bg-orange-50"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-sm w-4 text-center">{getQuantity(item._id)}</span>
                        <button 
                          onClick={() => handleAddToCart(item)}
                          className="bg-white rounded-full p-1 shadow-sm text-orange-600 hover:bg-orange-50"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Side */}
        <div className="md:w-1/3">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <h3 className="text-xl font-bold mb-4">Restaurant Info</h3>
            <div className="space-y-4 text-gray-600">
              <div className="flex items-start gap-3">
                <Clock className="text-orange-500 mt-0.5" size={20} />
                <div>
                  <p className="font-medium text-gray-900">Opening Hours</p>
                  <p className="text-sm mt-1">Mon-Sun: 10:00 AM - 10:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="text-orange-500 mt-0.5" size={20} />
                <div>
                  <p className="font-medium text-gray-900">Delivery Info</p>
                  <p className="text-sm mt-1">Minimum order $10. Delivery fee may apply based on distance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
