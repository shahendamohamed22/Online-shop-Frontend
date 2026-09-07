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

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const fetchCart = useCallback(
    async (showLoading = true) => {
      // لسه AuthContext بيحدد حالة المستخدم
      if (authLoading) return;

      // المستخدم مش مسجل دخول
      if (!isAuthenticated) {
        setCartItems([]);
        setCartTotal(0);
        setCartCount(0);
        setLoading(false);
        return;
      }

      if (showLoading) {
        setLoading(true);
      }

      try {
        const res = await axiosInstance.get("/api/cart");

        setCartItems(res.data?.items ?? []);
        setCartTotal(res.data?.totalPrice ?? 0);
        setCartCount(res.data?.totalItems ?? 0);
      } catch (error) {
        console.log(error);
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [isAuthenticated, authLoading]
  );

  useEffect(() => {
    if (authLoading) return;

    fetchCart(true);
  }, [authLoading, fetchCart]);

  const addToCart = async (
    productId,
    quantity = 1,
    productName = ""
  ) => {
    if (!isAuthenticated) {
      toast.info("سجّل دخول الأول عشان تضيف للسلة");
      return;
    }

    try {
      await axiosInstance.post("/api/cart", {
        productId,
        quantity,
      });

      await fetchCart(false);

      toast.success(
        productName
          ? `تم إضافة "${productName}" إلى السلة`
          : "تم الإضافة إلى السلة"
      );
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ أثناء الإضافة للسلة");
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;

    try {
      await axiosInstance.delete(`/api/cart/${productId}`);

      await fetchCart(false);
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ أثناء الحذف من السلة");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) return;

    if (quantity < 1) return;

    // تغيير الرقم فورًا في الشاشة
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );

    try {
      await axiosInstance.put(
        `/api/cart/${productId}`,
        {
          quantity,
        }
      );

      // نجيب الـ total والـ count الحقيقيين
      // بدون إظهار loading
      await fetchCart(false);
    } catch (error) {
      console.log(error);

      // لو الـ API فشل، نرجع الحقيقة
      await fetchCart(false);

      toast.error("حدث خطأ أثناء تحديث الكمية");
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      await axiosInstance.delete("/api/cart");

      await fetchCart(false);
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ أثناء تفريغ السلة");
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
        refetchCart: () => fetchCart(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
