import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../services/axiosInstance";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

// اتحولت بالكامل من بيانات محلية (data/products.js) لبيانات حقيقية من الـ API:
// - تفاصيل المنتج: GET /api/product/:id (عام، مش محتاج تسجيل دخول)
// - التقييمات: GET /api/review/product/:id (عام)
// - إضافة تقييم: POST /api/review (محتاج تسجيل دخول)

function ProductDetails() {
  const { id } = useParams();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await axiosInstance.get(`/api/review/product/${id}`);
      setReviews(res.data ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/api/product/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.log(error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("سجّل دخول الأول");
      return;
    }

    setSubmittingReview(true);
    try {
      await axiosInstance.post("/api/review", {
        productId: Number(id),
        rating: Number(newRating),
        comment: newComment,
      });
      setNewComment("");
      toast.success("تم إضافة تقييمك");
      fetchReviews();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message ?? "حصل خطأ أثناء إضافة التقييم");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <p className="container mt-4">جاري التحميل...</p>;
  if (!product) return <p className="container mt-4">المنتج غير موجود.</p>;

  const inWishlist = isInWishlist(product.id);
  const mainImage = product.images?.[0]?.url;

  return (
    <main className="container py-5">

      {/* Product Info */}
      <section className="row g-5 align-items-center">

        {/* Product Image */}
        <div className="col-12 col-lg-6">
          <div className="main-image-box">
            <img
              src={mainImage}
              alt={product.name}
              id="main-product-img"
              className="w-100"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="col-12 col-lg-6">

          <div className="d-flex justify-content-between align-items-start">
            <h1 className="fs-1 fw-bold mb-3">
              {product.name}
            </h1>

            <i
              className={`heart fa-solid fa-heart fa-xl ${inWishlist ? "main-color" : "color-gray"
                }`}
              onClick={() => toggleWishlist(product.id)}
              role="button"
            ></i>
          </div>

          {product.averageRating > 0 && (
            <div className="mb-3">
              <i className="fa-solid fa-star text-warning"></i>
              <span className="ms-2">
                {Number(product.averageRating).toFixed(1)}
              </span>
              <span className="text-muted ms-2">
                ({product.reviewsCount} تقييم)
              </span>
            </div>
          )}

          {product.description && (
            <p className="text-muted lh-lg mb-4">
              {product.description}
            </p>
          )}

          {/* Price */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <span className="fs-2 fw-bold">
              {product.newPrice} ج.م
            </span>

            {product.hasDiscount && (
              <>
                <s className="text-danger fs-5">
                  {product.oldPrice} ج.م
                </s>

                <span className="badge bg-main fs-6">
                  خصم {Math.round(product.discountPercentage)}%
                </span>
              </>
            )}
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <h6 className="mb-2">الكمية</h6>

            <div className="quantity-selector d-flex align-items-center">
              <button
                type="button"
                className="qty-btn"
                onClick={() =>
                  setQuantity((q) => Math.max(1, q - 1))
                }
              >
                -
              </button>

              <input
                type="number"
                value={quantity}
                min="1"
                readOnly
              />

              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Add To Cart */}
          <button
            className="btn btn-main w-100 py-3"
            disabled={!product.isAvailable}
            onClick={() =>
              addToCart(product.id, quantity, product.name)
            }
          >
            <i className="fa-solid fa-cart-shopping me-2"></i>
            {product.isAvailable
              ? "أضف إلى العربة"
              : "غير متوفر حاليًا"}
          </button>

        </div>
      </section>


      {/* Reviews */}
      <section className="mt-5 pt-5 border-top">

        <h2 className="fs-3 fw-bold mb-4">
          التقييمات
        </h2>

        {reviews.length === 0 ? (
          <p className="text-muted">
            لا يوجد تقييمات على هذا المنتج
          </p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-bottom pb-3 mb-3"
              >
                <div className="d-flex justify-content-between mb-2">

                  <strong>
                    {review.customerName}
                  </strong>

                  <span className="text-warning">
                    <i className="fa-solid fa-star"></i>{" "}
                    {review.rating}
                  </span>

                </div>

                <p className="mb-0 text-muted">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Add Review */}
        <div className="mt-5">

          <h3 className="fs-5 mb-3">
            أضيف تقييمك
          </h3>

          <form onSubmit={handleSubmitReview}>

            <select
              className="form-select mb-3"
              value={newRating}
              onChange={(e) =>
                setNewRating(e.target.value)
              }
              style={{ maxWidth: "180px" }}
            >
              <option value="5">5 - ممتاز</option>
              <option value="4">4 - جيد جدًا</option>
              <option value="3">3 - جيد</option>
              <option value="2">2 - مقبول</option>
              <option value="1">1 - ضعيف</option>
            </select>

            <textarea
              className="form-control mb-3"
              placeholder="اكتب تعليقك على المنتج..."
              value={newComment}
              onChange={(e) =>
                setNewComment(e.target.value)
              }
              rows={4}
              required
            />

            <button
              className="btn btn-main"
              type="submit"
              disabled={submittingReview}
            >
              {submittingReview
                ? "جاري الإرسال..."
                : "إرسال التقييم"}
            </button>

          </form>

        </div>
      </section>

    </main>
  );
}

export default ProductDetails;
