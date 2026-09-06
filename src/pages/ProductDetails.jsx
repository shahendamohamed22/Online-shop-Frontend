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
      toast.info("سجّلي دخول الأول عشان تقيّمي المنتج");
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
    <main className="container">
      <div className="main-image-box">
        <img src={mainImage} alt={product.name} id="main-product-img" />
      </div>

      <section className="container mt-4">
        <h1 className="fs-2">{product.name}</h1>
        {product.description && <p className="text-muted">{product.description}</p>}

        <div className="d-flex align-items-center gap-3 mt-1">
          <span className="fs-2 fw-bolder">{product.newPrice} ج.م</span>
          {product.hasDiscount && (
            <>
              <s className="text-danger fs-5">{product.oldPrice} ج.م</s>
              <span className="badge bg-main fs-6">
                خصم {Math.round(product.discountPercentage)}%
              </span>
            </>
          )}
        </div>

        {product.averageRating > 0 && (
          <p className="mt-2">
            <i className="fa-solid fa-star text-warning"></i> {product.averageRating}{" "}
            <span className="text-muted">({product.reviewsCount} تقييم)</span>
          </p>
        )}

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
            <button type="button" className="qty-btn" onClick={() => setQuantity((q) => q + 1)}>
              +
            </button>
          </div>

          <button
            className="btn btn-main"
            disabled={!product.isAvailable}
            onClick={() => addToCart(product.id, quantity, product.name)}
          >
            <span>{product.isAvailable ? "اضف إلى العربة" : "غير متوفر حاليًا"}</span>
          </button>

          <i
            className={`heart fa-solid fa-heart fa-2xl ${inWishlist ? "main-color" : "color-gray"}`}
            onClick={() => toggleWishlist(product.id)}
          ></i>
        </div>
      </section>

      {/* التقييمات */}
      <section className="container mt-5 mb-5">
        <h3 className="fs-4 mb-3">التقييمات</h3>

        {reviews.length === 0 ? (
          <p className="text-muted">لسه مفيش تقييمات على المنتج ده.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-bottom pb-2 mb-2">
              <div className="d-flex justify-content-between">
                <strong>{review.customerName}</strong>
                <span className="text-warning">
                  <i className="fa-solid fa-star"></i> {review.rating}
                </span>
              </div>
              <p className="mb-0 text-muted">{review.comment}</p>
            </div>
          ))
        )}

        <form onSubmit={handleSubmitReview} className="mt-4">
          <h5 className="fs-6">أضيفي تقييمك</h5>
          <select
            className="form-select mb-2"
            value={newRating}
            onChange={(e) => setNewRating(e.target.value)}
            style={{ maxWidth: "150px" }}
          >
            <option value="5">5 - ممتاز</option>
            <option value="4">4 - جيد جدًا</option>
            <option value="3">3 - جيد</option>
            <option value="2">2 - مقبول</option>
            <option value="1">1 - ضعيف</option>
          </select>
          <textarea
            className="form-control mb-2"
            placeholder="اكتبي تعليقك على المنتج..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={2}
            required
          />
          <button className="btn btn-main" type="submit" disabled={submittingReview}>
            {submittingReview ? "جاري الإرسال..." : "إرسال التقييم"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default ProductDetails;
