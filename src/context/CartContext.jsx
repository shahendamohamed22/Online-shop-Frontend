import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../services/axiosInstance";

// اتغيّرت بالكامل من نسخة الـ localStorage للنسخة اللي بتتكلم مع الباك اند الحقيقي
// (GET/POST/PUT/DELETE /api/cart)، عشان السلة تبقى محفوظة على حساب المستخدم
// نفسه على السيرفر، مش على المتصفح بس - ونفس السلة تظهر لو دخل من جهاز تاني.
// شكل الرد: { items: [...], totalPrice, totalItems }

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCartItems([]);
      setCartTotal(0);
      setCartCount(0);
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/cart");
      setCartItems(res.data?.items ?? []);
      setCartTotal(res.data?.totalPrice ?? 0);
      setCartCount(res.data?.totalItems ?? 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1, productName = "") => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("سجّلي دخول الأول عشان تضيفي للسلة");
      return;
    }
    try {
      await axiosInstance.post("/api/cart", { productId, quantity });
      toast.success(productName ? `تم إضافة "${productName}" إلى السلة` : "تم الإضافة إلى السلة");
      fetchCart(); // نعيد الجلب عشان نجيب السلة كاملة بعد التحديث (الإجمالي والكمية الجديدة)
    } catch (error) {
      console.log(error);
      toast.error("حصل خطأ أثناء الإضافة للسلة");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axiosInstance.delete(`/api/cart/${productId}`);
      fetchCart();
    } catch (error) {
      console.log(error);
      toast.error("حصل خطأ أثناء الحذف من السلة");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return; // منع الكمية تنزل تحت 1 - لو عايزة تصفير تستخدم removeFromCart
    try {
      await axiosInstance.put(`/api/cart/${productId}`, { quantity });
      fetchCart();
    } catch (error) {
      console.log(error);
      toast.error("حصل خطأ أثناء تحديث الكمية");
    }
  };

  const clearCart = async () => {
    try {
      await axiosInstance.delete("/api/cart");
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        cartCount,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refetchCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
