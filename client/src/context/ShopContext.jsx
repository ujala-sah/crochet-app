import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistIds, setWishlistIds] = useState([]);

  const applyCart = useCallback((data) => {
    if (typeof data?.itemCount === 'number') setCartCount(data.itemCount);
  }, []);

  const applyWishlist = useCallback((data) => {
    if (typeof data?.itemCount === 'number') setWishlistCount(data.itemCount);
    if (data?.items) setWishlistIds(data.items.map((item) => String(item.product._id)));
  }, []);

  const refresh = useCallback(async () => {
    if (!user) {
      setCartCount(0);
      setWishlistCount(0);
      setWishlistIds([]);
      return;
    }
    if (user.role === 'admin') {
      setCartCount(0);
      setWishlistCount(0);
      setWishlistIds([]);
      return;
    }
    try {
      const [cart, wish] = await Promise.all([
        api('/cart', { auth: true }),
        api('/wishlist', { auth: true }),
      ]);
      applyCart(cart);
      applyWishlist(wish);
    } catch {
      setCartCount(0);
      setWishlistCount(0);
      setWishlistIds([]);
    }
  }, [user, applyCart, applyWishlist]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      cartCount,
      wishlistCount,
      wishlistIds,
      refresh,
      applyCart,
      applyWishlist,
    }),
    [cartCount, wishlistCount, wishlistIds, refresh, applyCart, applyWishlist]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
}
