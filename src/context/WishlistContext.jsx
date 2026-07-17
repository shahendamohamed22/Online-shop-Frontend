import { createContext, useContext, useState, useEffect } from "react";

// بنعمل Context عشان أي component في التطبيق (Navbar, Shop, Wishlist...)
// يقدر يوصل لحالة المفضلة من غير ما نمرر props يدوي من فوق لتحت (prop drilling)

const WishlistContext = createContext();

const STORAGE_KEY = "wishlistIds";

export function WishlistProvider({ children }) {
  // هنا الفرق الأساسي عن main.js الأصلي:
  // بدل ما نخزن الـ HTML بتاع الكارت كله في localStorage (card.outerHTML)،
  // بنخزن بس مصفوفة IDs. المصفوفة هي الـ "source of truth" الوحيد،
  // وأي كارت بيترندر live من products.js + الـ IDs دي

  const [wishlistIds, setWishlistIds] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // كل ما الـ state يتغير، نحدث localStorage تلقائي (useEffect بيراقب wishlistIds)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const isInWishlist = (id) => wishlistIds.includes(id);

  const toggleWishlist = (id) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  return (
    <WishlistContext.Provider value={{ wishlistIds, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

// custom hook بسيط عشان مانكتبش useContext(WishlistContext) في كل صفحة
export function useWishlist() {
  return useContext(WishlistContext);
}
