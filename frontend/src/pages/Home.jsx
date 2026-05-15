import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await api.get('/restaurants');
        setRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurants', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div></div>;
  }

  return (
    <div>
      <div className="mb-12 bg-orange-100 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
        <div className="md:w-1/2 z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Delicious food, <br/>delivered to your door.
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Discover the best local restaurants and get your favorite meals delivered fast.
          </p>
          <div className="flex bg-white rounded-full p-2 shadow-md max-w-md">
            <input 
              type="text" 
              placeholder="Search for restaurants or cuisines..." 
              className="flex-1 px-4 py-2 outline-none rounded-l-full bg-transparent"
            />
            <button className="bg-orange-500 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition-colors">
              Search
            </button>
          </div>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 relative">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80" 
            alt="Food Delivery" 
            className="rounded-full w-64 h-64 md:w-80 md:h-80 object-cover shadow-2xl border-4 border-white mx-auto z-10 relative"
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Popular Restaurants</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {restaurants.map((restaurant, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={restaurant._id}
          >
            <Link to={`/restaurant/${restaurant._id}`} className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80"} 
                  alt={restaurant.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-lg text-sm font-bold flex items-center gap-1 shadow-md">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  {restaurant.rating}
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
                </div>
                <p className="text-gray-500 text-sm mb-4">{restaurant.cuisine}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 border-t pt-4">
                  <div className="flex items-center gap-1">
                    <Clock size={16} className="text-orange-500" />
                    <span>{restaurant.deliveryTime || '30-45 min'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    <span>Free delivery</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
