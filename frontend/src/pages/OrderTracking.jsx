import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Clock, ChefHat, Bike, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();

    // Simulate order status updates for demo purposes
    const statuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    let currentIndex = 0;
    
    const interval = setInterval(async () => {
      if (currentIndex < statuses.length - 1) {
        currentIndex++;
        try {
          const { data } = await api.put(`/orders/${id}/status`, { status: statuses[currentIndex] });
          setOrder(data);
        } catch (err) {}
      } else {
        clearInterval(interval);
      }
    }, 10000); // update every 10 seconds for demo

    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div></div>;
  if (!order) return <div className="text-center py-20 text-red-500 font-bold">Order not found</div>;

  const getStatusStep = (status) => {
    switch(status) {
      case 'pending': return 1;
      case 'confirmed': return 2;
      case 'preparing': return 3;
      case 'out_for_delivery': return 4;
      case 'delivered': return 5;
      default: return 1;
    }
  };

  const currentStep = getStatusStep(order.status);

  const steps = [
    { icon: <Clock size={24} />, title: 'Order Placed' },
    { icon: <CheckCircle size={24} />, title: 'Confirmed' },
    { icon: <ChefHat size={24} />, title: 'Preparing' },
    { icon: <Bike size={24} />, title: 'On the Way' },
    { icon: <Home size={24} />, title: 'Delivered' }
  ];

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-8 border-b pb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2 text-gray-900">Order #{order._id.substring(order._id.length - 6)}</h1>
            <p className="text-gray-500">From <span className="font-bold text-orange-500">{order.restaurant.name}</span></p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Estimated Delivery</p>
            <p className="text-xl font-bold text-gray-900">15-20 min</p>
          </div>
        </div>

        {/* Tracking Progress Bar */}
        <div className="relative mb-16 mt-10">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 z-0 transition-all duration-1000 ease-in-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          
          <div className="flex justify-between relative z-10">
            {steps.map((step, index) => {
              const isCompleted = currentStep > index;
              const isCurrent = currentStep === index + 1;
              return (
                <div key={index} className="flex flex-col items-center">
                  <motion.div 
                    initial={false}
                    animate={{ 
                      scale: isCurrent ? 1.2 : 1,
                      backgroundColor: isCompleted ? '#f97316' : isCurrent ? '#f97316' : '#fff',
                      color: isCompleted || isCurrent ? '#fff' : '#9ca3af',
                      borderColor: isCompleted || isCurrent ? '#f97316' : '#e5e7eb'
                    }}
                    className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 md:border-4 flex items-center justify-center mb-1 md:mb-2 shadow-sm"
                  >
                    <div className="scale-75 md:scale-100">
                      {step.icon}
                    </div>
                  </motion.div>
                  <span className={`text-[10px] md:text-xs font-bold text-center w-14 md:w-auto leading-tight ${isCurrent ? 'text-orange-500' : isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl">
          <h3 className="font-bold mb-4 text-lg">Order Details</h3>
          <div className="space-y-3 mb-4">
            {order.items.map(item => (
              <div key={item._id} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-orange-500">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-orange-500 font-bold hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
