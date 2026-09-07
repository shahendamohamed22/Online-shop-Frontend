import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";

function ReviewsPreview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get("/api/review/my");
        setReviews(res.data ?? []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const recentReviews = reviews.slice(0, 3);

  const renderStars = (rating) => {
    return (
      <div className="d-flex align-items-center gap-1" style={{ direction: "ltr" }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFull = rating >= star;
          const isHalf = rating === star - 0.5;

          return (
            <div key={star} style={{ position: "relative", width: "20px", height: "20px" }}>
              <i
                className="fa-regular fa-star"
                style={{ position: "absolute", top: 0, left: 0, fontSize: "18px", color: "#ffc107" }}
              />

              {isFull && (
                <i
                  className="fa-solid fa-star"
                  style={{ position: "absolute", top: 0, left: 0, fontSize: "18px", color: "#ffc107" }}
                />
              )}

              {isHalf && (
                <div
                  style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "100%", overflow: "hidden" }}
                >
                  <i
                    className="fa-solid fa-star"
                    style={{ position: "absolute", top: 0, left: 0, fontSize: "18px", color: "#ffc107" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="badge bg-main fs-4 mb-0">
          تقييماتي
        </h3>

        {reviews.length > 0 && (
          <Link to="/reviews" className="text-decoration-none">
            عرض كل التقييمات
          </Link>
        )}
      </div>

      {loading ? (
        <p className="text-muted">
          جاري تحميل التقييمات...
        </p>
      ) : recentReviews.length === 0 ? (
        <p className="text-muted">
          لا يوجد تقييمات
        </p>
      ) : (
        recentReviews.map((review) => (
          <div key={review.id} className="border rounded-3 p-3 mb-3">
            <div className="d-flex justify-content-between align-items-start gap-3">
              <div>
                <Link
                  to={`/product/${review.productId}`}
                  className="text-decoration-none text-black"
                >
                  <strong>{review.productName}</strong>
                </Link>

                <div className="d-flex align-items-center gap-2 mt-1">
                  {renderStars(review.rating)}

                  <span className="small fw-semibold">
                    {Number(review.rating).toFixed(1)}
                  </span>
                </div>
              </div>

              <small className="text-muted">
                {new Date(review.createdAt).toLocaleDateString("ar-EG")}
              </small>
            </div>

            <p className="text-muted mb-0 mt-2">
              {review.comment}
            </p>
          </div>
        ))
      )}
    </section>
  );
}

export default ReviewsPreview;

