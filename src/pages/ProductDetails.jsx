import { useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../data/products";
import { useWishlist } from "../context/WishlistContext";

// الصفحة الأصلية كانت hardcoded على منتج واحد بس
// هنا بقت ديناميكية: بتاخد الـ id من الرابط (useParams) وتجيب المنتج المناسب من products.js
// يعني /product/3 هيعرض المنتج رقم 3 تلقائي من غير ما نكرر أي HTML

function ProductDetails() {
  const { id } = useParams();
  const product = getProductById(id);
  const { isInWishlist, toggleWishlist } = useWishlist();

  // عداد الكمية - نفس منطق plus/minus بتاع main.js لكن كـ state بدل ما نعدل الـ input.value مباشرة
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <p className="container mt-4">المنتج غير موجود.</p>;
  }

  const inWishlist = isInWishlist(product.id);

  return (
    <main className="container">
      <div className="main-image-box">
        <img src={product.image} alt="صورة المنتج الرئيسية" id="main-product-img" />
      </div>

      <section className="container mt-4">
        <h1 className="fs-2">{product.fullName ?? product.name}</h1>

        <div className="d-flex align-items-center gap-3 mt-1">
          <span className="fs-2 fw-bolder">
            {product.detailPrice ?? product.price} ج.م
          </span>
          <s className="text-danger fs-5">{product.detailOldPrice ?? product.oldPrice} ج.م</s>
          <span className="badge bg-main fs-6">خصم {product.discount}%</span>
        </div>

        <div className="d-flex align-items-center gap-4 mt-4">
          <div className="quantity-selector">
            <button
              type="button"
              className="qty-btn"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              -
            </button>
            <input type="number" value={quantity} min="1" readOnly />
            <button
              type="button"
              className="qty-btn"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>

          <button className="btn btn-main">
            <span>اضف إلى العربة</span>
          </button>

          <i
            className={`heart fa-solid fa-heart fa-2xl ${
              inWishlist ? "main-color" : "color-gray"
            }`}
            onClick={() => toggleWishlist(product.id)}
          ></i>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;
