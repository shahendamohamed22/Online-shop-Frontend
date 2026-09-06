import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

// اتظبطت لتقرا من الباك اند الحقيقي (wishlistItems من WishlistContext) بدل البيانات المحلية.
// شكل عنصر المفضلة الراجع من /api/wishlist مختلف عن شكل المنتج العادي
// (productId/productName/productImage مفردة بدل id/name/images array)،
// فبنعمل تحويل بسيط (map) هنا عشان نقدر نستخدم نفس ProductCard من غير ما نعدلها.

function Wishlist() {
  const { wishlistItems, loading } = useWishlist();

  const productsForCard = wishlistItems.map((item) => ({
    id: item.productId,
    name: item.productName,
    newPrice: item.newPrice,
    oldPrice: item.oldPrice,
    hasDiscount: item.hasDiscount,
    discountPercentage: item.discountPercentage,
    images: [{ url: item.productImage }],
  }));

  return (
    <main className="container">
      <h2 className="badge bg-main mt-2 fs-3">المفضلة</h2>
      <div className="mt-3">
        <div className="row g-3">
          {loading ? (
            <p>جاري التحميل...</p>
          ) : productsForCard.length === 0 ? (
            <p className="mt-3">لا يوجد منتجات في المفضلة.</p>
          ) : (
            productsForCard.map((product) => <ProductCard key={product.id} product={product} />)
          )}
        </div>
      </div>
    </main>
  );
}

export default Wishlist;
