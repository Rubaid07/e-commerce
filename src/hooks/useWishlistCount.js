// src/hooks/useWishlistCount.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import axios from 'axios';
import { wishlistManager } from '../utils/wishlistManager';

export const useWishlistCount = () => {
  const { currentUser, token } = useAuth();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchWishlistCount = useCallback(async () => {
    console.log('Fetching wishlist count for user:', currentUser?.email);
    
    if (!currentUser) {
      setWishlistCount(0);
      setLoading(false);
      return;
    }

    try {
      // Try API first
      const response = await axios.get('http://localhost:5000/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const count = response.data.length;
      setWishlistCount(count);
      
      // Sync with localStorage as backup
      const wishlistKey = `wishlist_${currentUser.email}`;
      const apiWishlist = response.data.map(item => ({
        productId: item.product?._id || item.productId,
        name: item.product?.name,
        price: item.product?.price,
        addedAt: item.addedAt
      }));
      localStorage.setItem(wishlistKey, JSON.stringify(apiWishlist));
      
      console.log('API wishlist count:', count);
    } catch (error) {
      console.log('API failed, using localStorage');
      // Fallback to localStorage
      const count = wishlistManager.getWishlistCount(currentUser.email);
      setWishlistCount(count);
      console.log('LocalStorage wishlist count:', count);
    } finally {
      setLoading(false);
    }
  }, [currentUser, token]);

  useEffect(() => {
    // Initial fetch
    fetchWishlistCount();

    // Subscribe to wishlist updates
    const unsubscribe = wishlistManager.addListener(() => {
      console.log('WishlistManager notified, refreshing count');
      fetchWishlistCount();
    });

    // Listen for custom events
    const handleCustomEvent = () => {
      console.log('Custom wishlist event received');
      fetchWishlistCount();
    };

    window.addEventListener('wishlist-updated', handleCustomEvent);
    window.addEventListener('wishlistChanged', handleCustomEvent);

    // Polling for updates (optional, as fallback)
    const pollInterval = setInterval(() => {
      if (currentUser) {
        fetchWishlistCount();
      }
    }, 10000); // Poll every 10 seconds

    return () => {
      unsubscribe();
      clearInterval(pollInterval);
      window.removeEventListener('wishlist-updated', handleCustomEvent);
      window.removeEventListener('wishlistChanged', handleCustomEvent);
    };
  }, [fetchWishlistCount, currentUser]);

  // Function to manually refresh
  const refreshWishlistCount = () => {
    fetchWishlistCount();
  };

  return { 
    wishlistCount, 
    loading, 
    refreshWishlistCount,
    triggerWishlistUpdate: wishlistManager.triggerUpdate 
  };
};

// Export for use in other components
export const triggerWishlistUpdate = () => {
  wishlistManager.triggerUpdate();
};