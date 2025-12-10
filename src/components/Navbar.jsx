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
          ? 'bg-white/95 backdrop-blur-lg shadow-lg py-2 sm:py-3' 
          : 'bg-white/90 backdrop-blur-md shadow-sm py-3 sm:py-4'
      }`}>
        <div className="lg:max-w-10/12 mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo - Responsive sizing */}
            <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2 group flex-shrink-0">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-black to-gray-800 rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                  <span className="text-white font-bold text-lg sm:text-xl">R</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-black to-gray-800 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              </div>
              <div className="">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
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
                  className={`relative flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 group ${
                    location.pathname === link.path
                      ? 'text-black font-semibold'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {link.icon}
                  <span className="text-sm lg:text-base">{link.label}</span>
                  
                  {/* Active indicator */}
                  {location.pathname === link.path && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-black rounded-full"></div>
                  )}
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
                </Link>
              ))}
            </div>

            {/* Right Side Actions - Responsive spacing */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-4">
              {/* Wishlist Icon - Only show if user is logged in */}
              {currentUser && (
                <Link 
                  to="/wishlist" 
                  className="relative p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
                  title="My Wishlist"
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                  {displayWishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-medium">
                      {displayWishlistCount > 9 ? '9+' : displayWishlistCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Cart Icon - Responsive sizing */}
              <Link 
                to="/checkout" 
                className="relative p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group" 
                title="My Cart"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:scale-110 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-black text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-medium">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              {/* Auth Section - Desktop */}
              {currentUser ? (
                <div className="profile-menu-container relative hidden sm:block">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-1 sm:space-x-2 pl-2 sm:pl-3 pr-1 sm:pr-2 py-1 sm:py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors duration-200 border border-gray-200 group"
                  >
                    {/* Profile Image/Initial - Responsive sizing */}
                    {photoURL ? (
                      <img
                        src={photoURL}
                        alt="profile"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-white group-hover:ring-gray-200 transition-all"
                      />
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-black to-gray-700 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                        {getInitial()}
                      </div>
                    )}
                    
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{getUserName()}</p>
                      <p className="text-xs text-gray-500 capitalize">{role}</p>
                    </div>
                    
                    <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-transform duration-200 ${
                      showProfileMenu ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Profile Dropdown Menu - Responsive width */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-52 sm:w-56 bg-white rounded-xl shadow-lg border py-2 z-50 animate-fadeIn">
                      {/* User Info */}
                      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          {photoURL ? (
                            <img
                              src={photoURL}
                              alt="profile"
                              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-black to-gray-700 text-white rounded-full flex items-center justify-center text-base sm:text-lg font-bold">
                              {getInitial()}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 text-sm truncate">{getUserName()}</p>
                            <p className="text-xs sm:text-sm text-gray-500 capitalize">{role}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>My Profile</span>
                        </Link>
                        
                        <Link
                          to="/orders"
                          className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                        >
                          <Package className="w-4 h-4" />
                          <span>My Orders</span>
                        </Link>

                        <Link
                          to="/wishlist"
                          className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          <span>My Wishlist</span>
                          {displayWishlistCount > 0 && (
                            <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                              {displayWishlistCount}
                            </span>
                          )}
                        </Link>

                        {role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors border-t mt-2 pt-2"
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
                          className="flex items-center justify-center space-x-2 w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg mx-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Login Button for non-authenticated users - Responsive
                <Link
                  to="/login"
                  className="hidden sm:flex items-center space-x-1 sm:space-x-2 px-3 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-black to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-black transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="font-medium">Login</span>
                </Link>
              )}

              {/* Mobile Menu Toggle - Always visible on mobile */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Responsive width */}
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

        {/* Menu Panel - Responsive width */}
        <div className="absolute right-0 top-0 h-full w-[85vw] sm:w-80 max-w-sm bg-white shadow-xl overflow-y-auto">
          {/* Menu Header - Responsive padding */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              {currentUser && photoURL ? (
                <img
                  src={photoURL}
                  alt="profile"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                />
              ) : currentUser ? (
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-black to-gray-700 text-white rounded-full flex items-center justify-center text-base sm:text-lg font-bold flex-shrink-0">
                  {getInitial()}
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                {currentUser ? (
                  <>
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{getUserName()}</p>
                    <p className="text-xs sm:text-sm text-gray-500 capitalize">{role}</p>
                  </>
                ) : (
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Welcome Guest</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Mobile Navigation Links - Responsive padding */}
          <div className="p-3 sm:p-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg mb-1 transition-colors text-sm sm:text-base ${
                  location.pathname === link.path
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className={`p-1.5 sm:p-2 rounded-lg ${
                  location.pathname === link.path 
                    ? 'bg-white/20' 
                    : 'bg-gray-100'
                }`}>
                  {link.icon}
                </div>
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
            
            {/* Mobile Wishlist Link */}
            {currentUser && (
              <Link
                to="/wishlist"
                className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg mb-1 transition-colors text-sm sm:text-base ${
                  location.pathname === '/wishlist'
                    ? 'bg-red-50 text-red-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className={`p-1.5 sm:p-2 rounded-lg ${
                  location.pathname === '/wishlist'
                    ? 'bg-red-100'
                    : 'bg-gray-100'
                }`}>
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="font-medium">My Wishlist</span>
                {displayWishlistCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {displayWishlistCount > 9 ? '9+' : displayWishlistCount}
                  </span>
                )}
              </Link>
            )}
            
            {/* Mobile Cart Link */}
            <Link
              to="/checkout"
              className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg mb-1 transition-colors text-sm sm:text-base ${
                location.pathname === '/checkout'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className={`p-1.5 sm:p-2 rounded-lg ${
                location.pathname === '/checkout'
                  ? 'bg-blue-100'
                  : 'bg-gray-100'
              }`}>
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="font-medium">My Cart</span>
              {itemCount > 0 && (
                <span className="ml-auto bg-black text-white text-xs px-2 py-0.5 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* My Orders Link (Mobile) */}
            {currentUser && (
              <Link
                to="/orders"
                className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg mb-1 transition-colors text-sm sm:text-base ${
                  location.pathname === '/orders'
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className={`p-1.5 sm:p-2 rounded-lg ${
                  location.pathname === '/orders'
                    ? 'bg-purple-100'
                    : 'bg-gray-100'
                }`}>
                  <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="font-medium">My Orders</span>
              </Link>
            )}
          </div>

          {/* Mobile Auth Section - Responsive padding */}
          <div className="absolute bottom-0 left-0 right-0 border-t p-4 sm:p-6 bg-white">
            {currentUser ? (
              <div className="space-y-2 sm:space-y-3">
                <Link
                  to="/profile"
                  className="flex items-center justify-center space-x-2 px-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>My Profile</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center space-x-2 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-black transition-all text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
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