import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-orange-500 flex items-center gap-2">
          <span className="bg-orange-500 text-white p-1 rounded-md">Food</span>Mini
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/checkout" className="relative flex items-center text-gray-700 hover:text-orange-500 transition-colors">
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartItemCount}
              </span>
            )}
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium flex items-center gap-2">
                <User size={18} /> {user.name}
              </span>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-gray-700 hover:text-orange-500 font-medium">Log in</Link>
              <Link to="/register" className="bg-orange-500 text-white px-4 py-2 rounded-full font-medium hover:bg-orange-600 transition-colors">
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle & Cart */}
        <div className="flex items-center gap-4 md:hidden">
          <Link to="/checkout" className="relative flex items-center text-gray-700 hover:text-orange-500 transition-colors">
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartItemCount}
              </span>
            )}
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 hover:text-orange-500 transition-colors"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-4 shadow-lg absolute w-full left-0">
          {user ? (
            <>
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="bg-orange-100 p-2 rounded-full text-orange-500">
                  <User size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-500 py-3 rounded-xl font-medium hover:bg-red-100 transition-colors"
              >
                <LogOut size={18} /> Log out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <Link 
                to="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center bg-orange-50 text-orange-600 py-3 rounded-xl font-medium hover:bg-orange-100 transition-colors"
              >
                Log in
              </Link>
              <Link 
                to="/register" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center bg-orange-500 text-white py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
