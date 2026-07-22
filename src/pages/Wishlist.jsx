import { products } from "../data/products";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

// قبل كده الصفحة كانت بتقرا HTML جاهز اتخزن في localStorage وتحطه بـ innerHTML
// دلوقتي بنقرا بس IDs من الـ context، ونفلتر products.js عليها، ونرندر نفس ProductCard
// المستخدم في المتجر - يعني مفيش تكرار كود ولا تكرار تصميم

function Wishlist() {
  const { wishlistIds } = useWishlist();
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <main className="container">
      <h2 className="badge bg-main mt-2 fs-3">المفضلة</h2>
      <div className="mt-3">
        <div className="row g-3">
          {wishlistProducts.length === 0 ? (
            <p className="mt-3"></p>
          ) : (
            wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default Wishlist;
