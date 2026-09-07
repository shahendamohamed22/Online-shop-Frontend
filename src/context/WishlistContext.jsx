import { createContext, useContext, useState, useEffect, useCallback} from "react";
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

  // =========================
  // Fetch Wishlist
  // =========================
  const fetchWishlist = useCallback(async () => {
    // استنى لحد ما AuthContext يحدد حالة المستخدم
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

  // أول ما حالة الـ Auth تخلص، هات الـ Wishlist
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // =========================
  // Check if product is in wishlist
  // =========================
  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) => item.productId === productId
    );
  };

  // =========================
  // Add / Remove Wishlist
  // =========================
  const toggleWishlist = async (productId) => {
    // لازم يكون مسجل دخول
    if (!isAuthenticated) {
      toast.info("سجّل دخول الأول");
      return;
    }

    const alreadyIn = isInWishlist(productId);

    // =========================
    // Remove from Wishlist
    // =========================
    if (alreadyIn) {
      // غير شكل القلب فورًا
      setWishlistItems((prev) =>
        prev.filter(
          (item) => item.productId !== productId
        )
      );

      try {
        await axiosInstance.delete(
          `/api/wishlist/${productId}`
        );

        toast.success(
          "تمت إزالة المنتج من المفضلة"
        );
      } catch (error) {
        console.log(error);

        // لو الـ API فشل، رجّع الـ Wishlist الحقيقية
        await fetchWishlist();

        toast.error("حدث خطأ، حاول تاني");
      }

      return;
    }

    // =========================
    // Add to Wishlist
    // =========================

    // غير شكل القلب فورًا
    setWishlistItems((prev) => [
      ...prev,
      { productId },
    ]);

    try {
      await axiosInstance.post(
        `/api/wishlist/${productId}`
      );

      toast.success(
        "تمت إضافة المنتج إلى المفضلة"
      );
    } catch (error) {
      console.log(error);

      // لو الـ API فشل، رجّع القلب لحالته القديمة
      setWishlistItems((prev) =>
        prev.filter(
          (item) => item.productId !== productId
        )
      );

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
        refetchWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}