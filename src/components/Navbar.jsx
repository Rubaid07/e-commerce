// src/components/Navbar.jsx
import { Link, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../context/CartContext";
import { useWishlistCount } from "../hooks/useWishlistCount";
import { 
  ShoppingCart, 
  LogOut, 
  User, 
  Menu, 
  X, 
  Home, 
  Store, 
  Shield, 
  ChevronDown,
  Heart,
  Package
} from "lucide-react";
import { useState, useEffect } from "react";
import { wishlistManager } from "../utils/wishlistManager";

const Navbar = () => {
  const { currentUser, role, logout, photoURL } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount, refreshWishlistCount } = useWishlistCount();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [localWishlistCount, setLocalWishlistCount] = useState(0);

  // Detect scroll for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setShowProfileMenu(false);
  }, [location.pathname]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileMenu]);


  // Real-time wishlist count subscription
   useEffect(() => {
    // Initial count
    if (currentUser) {
      const count = wishlistManager.getWishlistCount(currentUser.email);
      setLocalWishlistCount(count);
    }

    // Subscribe to wishlist updates
    const unsubscribe = wishlistManager.addListener(() => {
      if (currentUser) {
        const count = wishlistManager.getWishlistCount(currentUser.email);
        setLocalWishlistCount(count);
        console.log('Navbar wishlist count updated:', count);
      }
    });

    // Listen for custom events
    const handleWishlistEvent = () => {
      refreshWishlistCount(); // Force refresh from hook
    };

    window.addEventListener('wishlist-updated', handleWishlistEvent);
    window.addEventListener('wishlistChanged', handleWishlistEvent);

    // Make refresh function available globally
    window.updateNavbarWishlist = refreshWishlistCount;

    return () => {
      unsubscribe();
      window.removeEventListener('wishlist-updated', handleWishlistEvent);
      window.removeEventListener('wishlistChanged', handleWishlistEvent);
      delete window.updateNavbarWishlist;
    };
  }, [currentUser, refreshWishlistCount]);
  // Use the maximum of hook count and local count
  const displayWishlistCount = Math.max(wishlistCount, localWishlistCount);

  const getInitial = () => {
    if (!currentUser) return "";
    if (currentUser.displayName) return currentUser.displayName.charAt(0).toUpperCase();
    return currentUser.email.charAt(0).toUpperCase();
  };

  const getUserName = () => {
    if (!currentUser) return "";
    if (currentUser.displayName) return currentUser.displayName;
    return currentUser.email.split('@')[0];
  };

  const navLinks = [
    { path: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { path: "/shop", label: "Shop", icon: <Store className="w-4 h-4" /> },
  ];

  // Add admin link if user is admin
  if (role === 'admin') {
    navLinks.push({ 
      path: "/admin", 
      label: "Admin Panel", 
      icon: <Shield className="w-4 h-4" /> 
    });
  }

  return (
    <>
      {/* Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg py-3' 
          : 'bg-white/90 backdrop-blur-md shadow-sm py-4'
      }`}>
        <div className="max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-800 rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">R</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-black to-gray-800 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                  Realm Wear
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Premium Fashion</p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 group ${
                    location.pathname === link.path
                      ? 'text-black font-semibold'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                  
                  {/* Active indicator */}
                  {location.pathname === link.path && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-black rounded-full"></div>
                  )}
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Wishlist Icon - Only show if user is logged in */}
              {currentUser && (
                <Link 
                  to="/wishlist" 
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
                  title="My Wishlist"
                >
                  <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Cart Icon */}
              <Link 
                to="/checkout" 
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group" 
                title="My Cart"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:scale-110 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              {/* Auth Section */}
              {currentUser ? (
                <div className="profile-menu-container relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 pl-3 pr-2 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors duration-200 border border-gray-200 group"
                  >
                    {/* Profile Image/Initial */}
                    {photoURL ? (
                      <img
                        src={photoURL}
                        alt="profile"
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white group-hover:ring-gray-200 transition-all"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-black to-gray-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {getInitial()}
                      </div>
                    )}
                    
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
                      <p className="text-xs text-gray-500 capitalize">{role}</p>
                    </div>
                    
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      showProfileMenu ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border py-2 z-50 animate-fadeIn">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b">
                        <div className="flex items-center space-x-3">
                          {photoURL ? (
                            <img
                              src={photoURL}
                              alt="profile"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-700 text-white rounded-full flex items-center justify-center text-lg font-bold">
                              {getInitial()}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{getUserName()}</p>
                            <p className="text-sm text-gray-500 capitalize">{role}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>My Profile</span>
                        </Link>
                        
                        <Link
                          to="/orders"
                          className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                        >
                          <Package className="w-4 h-4" />
                          <span>My Orders</span>
                        </Link>

                        <Link
                          to="/wishlist"
                          className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          <span>My Wishlist</span>
                          {wishlistCount > 0 && (
                            <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                              {wishlistCount}
                            </span>
                          )}
                        </Link>

                        {role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors border-t mt-2 pt-2"
                          >
                            <Shield className="w-4 h-4" />
                            <span>Admin Panel</span>
                          </Link>
                        )}
                      </div>

                      {/* Logout Button */}
                      <div className="border-t pt-2">
                        <button
                          onClick={() => {
                            logout();
                            setShowProfileMenu(false);
                          }}
                          className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors rounded-lg mx-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Login Button for non-authenticated users
                <Link
                  to="/login"
                  className="hidden sm:flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-black to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-black transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">Login</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Overlay */}
        <div 
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-3">
              {currentUser && photoURL ? (
                <img
                  src={photoURL}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : currentUser ? (
                <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-700 text-white rounded-full flex items-center justify-center text-lg font-bold">
                  {getInitial()}
                </div>
              ) : null}
              <div>
                {currentUser ? (
                  <>
                    <p className="font-medium text-gray-900">{getUserName()}</p>
                    <p className="text-sm text-gray-500 capitalize">{role}</p>
                  </>
                ) : (
                  <p className="font-medium text-gray-900">Welcome Guest</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="p-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-3 px-4 py-3.5 rounded-lg mb-1 transition-colors ${
                  location.pathname === link.path
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className={`p-2 rounded-lg ${
                  location.pathname === link.path 
                    ? 'bg-white/20' 
                    : 'bg-gray-100'
                }`}>
                  {link.icon}
                </div>
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
            
            {/* Mobile Wishlist Link (only for logged in users) */}
             {currentUser && (
                <Link 
                  to="/wishlist" 
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
                  title="My Wishlist"
                >
                  <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                  {displayWishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {displayWishlistCount > 9 ? '9+' : displayWishlistCount}
                    </span>
                  )}
                </Link>
              )}
            
            {/* Mobile Cart Link */}
            <Link
              to="/checkout"
              className={`flex items-center space-x-3 px-4 py-3.5 rounded-lg mb-1 transition-colors ${
                location.pathname === '/checkout'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className={`p-2 rounded-lg ${
                location.pathname === '/checkout'
                  ? 'bg-blue-100'
                  : 'bg-gray-100'
              }`}>
                <ShoppingCart className="w-5 h-5" />
              </div>
              <span className="font-medium">My Cart</span>
              {itemCount > 0 && (
                <span className="ml-auto bg-black text-white text-xs px-2 py-0.5 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Auth Section */}
          <div className="absolute bottom-0 left-0 right-0 border-t p-6">
            {currentUser ? (
              <div className="space-y-3">
                <Link
                  to="/profile"
                  className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>My Profile</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-black transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>Login / Register</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;