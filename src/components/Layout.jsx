import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { 
  HomeIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
  PencilSquareIcon,
  UserCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getNavItems = () => {
    const baseItems = [
      { path: '/', label: 'Home', icon: HomeIcon },
      { path: '/blogs', label: 'Blogs', icon: DocumentTextIcon },
    ];

    if (user) {
      if (user.role === 'admin') {
        baseItems.push({ path: '/admin', label: 'Admin Dashboard', icon: ShieldCheckIcon });
      } else if (user.role === 'author') {
        baseItems.push({ path: '/dashboard', label: 'Dashboard', icon: PencilSquareIcon });
      }
      baseItems.push({ path: '/profile', label: 'Profile', icon: UserCircleIcon });
    }

    return baseItems;
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <nav className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary-600">
               <span className='text-amber-600'>Blog</span>Spot
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {getNavItems().map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {item.label}
                  </Link>
                );
              })}

              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-secondary-600">
                    Welcome, {user.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-secondary-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="btn-secondary"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-secondary-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-secondary-600">
            <p>&copy; 2024 BlogHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
