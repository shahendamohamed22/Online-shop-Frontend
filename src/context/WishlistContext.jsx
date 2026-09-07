import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import axiosInstance from "../services/axiosInstance";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const fetchWishlist = useCallback(async () => {
    // لسه بنحدد حالة الـ login
    if (authLoading) return;

    // المستخدم مش مسجل دخول
    if (!isAuthenticated) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.get("/api/wishlist");
      setWishlistItems(res.data ?? []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId) =>
    wishlistItems.some(
      (item) => item.productId === productId
    );

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.info("سجّل دخول الأول");
      return;
    }

    const alreadyIn = isInWishlist(productId);

    try {
      if (alreadyIn) {
        await axiosInstance.delete(
          `/api/wishlist/${productId}`
        );

        setWishlistItems((prev) =>
          prev.filter(
            (item) => item.productId !== productId
          )
        );
      } else {
        await axiosInstance.post(
          `/api/wishlist/${productId}`
        );

        await fetchWishlist();
      }
    } catch (error) {
      console.log(error);

      toast.error("حدث خطأ، حاول تاني");
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isInWishlist,
        toggleWishlist,
        loading,
        refetchWishlist: () => fetchWishlist(),
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}