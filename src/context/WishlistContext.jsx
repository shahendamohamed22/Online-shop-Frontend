import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../services/axiosInstance";

// اتغيّرت بالكامل من نسخة الـ localStorage للنسخة اللي بتتكلم مع الباك اند الحقيقي
// (GET/POST/DELETE /api/wishlist)، عشان المفضلة تبقى محفوظة على حساب المستخدم نفسه
// مش على المتصفح بس، وتفضل موجودة حتى لو غيّر جهاز.
// الـ endpoints دي "Customer Only" يعني لازم تسجيل دخول (فيه توكن في localStorage).

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setWishlistItems([]);
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
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId) =>
    wishlistItems.some((item) => item.productId === productId);

  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("سجّلي دخول الأول عشان تضيفي للمفضلة");
      return;
    }

    const alreadyIn = isInWishlist(productId);
    try {
      if (alreadyIn) {
        await axiosInstance.delete(`/api/wishlist/${productId}`);
        setWishlistItems((prev) => prev.filter((item) => item.productId !== productId));
      } else {
        await axiosInstance.post(`/api/wishlist/${productId}`);
        // بعد الإضافة، بنعيد جلب القائمة عشان ناخد بيانات المنتج كاملة من الباك اند
        fetchWishlist();
      }
    } catch (error) {
      console.log(error);
      toast.error("حصل خطأ، حاولي تاني");
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, isInWishlist, toggleWishlist, loading, refetchWishlist: fetchWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
