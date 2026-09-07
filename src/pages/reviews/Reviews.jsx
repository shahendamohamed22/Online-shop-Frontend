import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../services/axiosInstance";

function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editingReview, setEditingReview] = useState(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState("");
    const [updating, setUpdating] = useState(false);

    // Get My Reviews
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axiosInstance.get("/api/review/my");
                setReviews(res.data ?? []);
            } catch (error) {
                console.log(error);
                toast.error(
                    error.response?.data?.message ?? "حدث خطأ أثناء تحميل التقييمات"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    // Open Edit Modal
    const handleEdit = (review) => {
        setEditingReview(review);
        setEditRating(review.rating);
        setEditComment(review.comment ?? "");
    };

    // Rating
    const handleRating = (star, isHalf) => {
        const rating = isHalf ? star - 0.5 : star;
        setEditRating(rating);
    };

    // Update Review
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!editRating) {
            toast.error("اختاري التقييم");
            return;
        }

        if (!editComment.trim()) {
            toast.error("اكتبي تعليق");
            return;
        }

        setUpdating(true);

        try {
            await axiosInstance.put(`/api/review/${editingReview.id}`, {
                rating: editRating,
                comment: editComment.trim(),
            });

            setReviews((prev) =>
                prev.map((review) =>
                    review.id === editingReview.id
                        ? {
                            ...review,
                            rating: editRating,
                            comment: editComment.trim(),
                        }
                        : review
                )
            );

            toast.success("تم تحديث التقييم بنجاح");

            setEditingReview(null);
            setEditRating(0);
            setEditComment("");
        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message ?? "حدث خطأ أثناء تحديث التقييم"
            );
        } finally {
            setUpdating(false);
        }
    };

    // Delete Review
    const handleDelete = async (reviewId) => {
        const confirmed = window.confirm(
            "هل أنتِ متأكدة إنك عاوزة تمسحي التقييم؟"
        );

        if (!confirmed) return;

        try {
            await axiosInstance.delete(`/api/review/${reviewId}`);

            setReviews((prev) =>
                prev.filter((review) => review.id !== reviewId)
            );

            toast.success("تم حذف التقييم بنجاح");
        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message ?? "حدث خطأ أثناء حذف التقييم"
            );
        }
    };

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const renderStars = (rating, interactive = false) => {
        return (
            <div className="d-flex align-items-center gap-1" style={{ direction: "ltr" }}>
                {[1, 2, 3, 4, 5].map((star) => {
                    const isFull = rating >= star;
                    const isHalf = rating === star - 0.5;

                    if (!interactive) {
                        return (
                            <div key={star} style={{ position: "relative", width: "22px", height: "22px" }}>
                                <i
                                    className="fa-regular fa-star"
                                    style={{ position: "absolute", top: 0, left: 0, fontSize: "20px", color: "#ffc107" }}
                                />

                                {isFull && (
                                    <i
                                        className="fa-solid fa-star"
                                        style={{ position: "absolute", top: 0, left: 0, fontSize: "20px", color: "#ffc107" }}
                                    />
                                )}

                                {isHalf && (
                                    <div style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "100%", overflow: "hidden" }}>
                                        <i
                                            className="fa-solid fa-star"
                                            style={{ position: "absolute", top: 0, left: 0, fontSize: "20px", color: "#ffc107" }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <div key={star} style={{ position: "relative", width: "32px", height: "32px" }}>
                            {/* Empty star */}
                            <i
                                className="fa-regular fa-star"
                                style={{ position: "absolute", top: 0, left: 0, fontSize: "28px", color: "#ffc107" }}
                            />

                            {/* Full star */}
                            {isFull && (
                                <i
                                    className="fa-solid fa-star"
                                    style={{ position: "absolute", top: 0, left: 0, fontSize: "28px", color: "#ffc107" }}
                                />
                            )}

                            {/* Half star */}
                            {isHalf && (
                                <div style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "100%", overflow: "hidden", pointerEvents: "none" }}>
                                    <i
                                        className="fa-solid fa-star"
                                        style={{ position: "absolute", top: 0, left: 0, fontSize: "28px", color: "#ffc107" }}
                                    />
                                </div>
                            )}

                            {/* Click areas */}
                            <div style={{ position: "absolute", inset: 0, display: "flex", zIndex: 2 }}>
                                {/* Half */}
                                <button
                                    type="button"
                                    onClick={() => handleRating(star, true)}
                                    style={{ width: "50%", border: "none", background: "transparent", padding: 0, cursor: "pointer" }}
                                />

                                {/* Full */}
                                <button
                                    type="button"
                                    onClick={() => handleRating(star, false)}
                                    style={{ width: "50%", border: "none", background: "transparent", padding: 0, cursor: "pointer" }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <p>جاري تحميل التقييمات...</p>
            </div>
        );
    }

    return (
        <>
            <div className="container mt-4" style={{ maxWidth: "1000px" }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="badge bg-main fs-4 mb-0">
                        تقييماتي
                    </h2>

                    <span className="text-muted">
                        {reviews.length} تقييم
                    </span>
                </div>

                {reviews.length === 0 ? (
                    <div className="text-center py-5">
                        <i
                            className="fa-regular fa-star mb-3"
                            style={{ fontSize: "50px", color: "#ccc" }}
                        />

                        <h5>مفيش تقييمات لسه</h5>

                        <p className="text-muted">
                            المنتجات اللي قيمتيها هتظهر هنا
                        </p>

                        <Link to="/shop" className="btn btn-main mt-2">
                            تصفحي المنتجات
                        </Link>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="border rounded-3 p-4 mb-3">
                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-start gap-3">
                                <div>
                                    <Link
                                        to={`/product/${review.productId}`}
                                        className="text-decoration-none text-black"
                                    >
                                        <h5 className="mb-1">
                                            {review.productName}
                                        </h5>
                                    </Link>

                                    <div className="d-flex align-items-center gap-2">
                                        {renderStars(review.rating)}

                                        <span className="fw-semibold">
                                            {Number(review.rating).toFixed(1)}
                                        </span>
                                    </div>
                                </div>

                                <small className="text-muted">
                                    {formatDate(review.createdAt)}
                                </small>
                            </div>

                            {/* Comment */}
                            <p className="mt-3 mb-3 text-muted">
                                {review.comment}
                            </p>

                            {/* Actions */}
                            <div className="d-flex gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => handleEdit(review)}
                                >
                                    <i className="fa-solid fa-pen me-1"></i>
                                    تعديل
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => handleDelete(review.id)}
                                >
                                    <i className="fa-solid fa-trash me-1"></i>
                                    حذف
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Edit Modal */}
            {editingReview && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
                >
                    <div
                        className="bg-white rounded-4 p-4 shadow"
                        style={{ width: "90%", maxWidth: "500px" }}
                    >
                        {/* Modal Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="mb-0">
                                تعديل التقييم
                            </h4>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setEditingReview(null)}
                            />
                        </div>

                        <p className="fw-semibold mb-3">
                            {editingReview.productName}
                        </p>

                        <form onSubmit={handleUpdate}>
                            {/* Rating */}
                            <div className="mb-4">
                                <label className="form-label">
                                    التقييم
                                </label>

                                <div>
                                    {renderStars(editRating, true)}
                                </div>

                                <div className="text-muted small mt-2">
                                    {editRating > 0
                                        ? `تقييمك: ${editRating}`
                                        : "اختاري تقييمك"}
                                </div>
                            </div>

                            {/* Comment */}
                            <div className="mb-4">
                                <label className="form-label">
                                    تعليقك
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={editComment}
                                    onChange={(e) => setEditComment(e.target.value)}
                                    placeholder="اكتبي رأيك في المنتج..."
                                />
                            </div>

                            {/* Buttons */}
                            <div className="d-flex gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-main flex-grow-1"
                                    disabled={updating}
                                >
                                    {updating ? "جاري الحفظ..." : "حفظ التعديلات"}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setEditingReview(null)}
                                    disabled={updating}
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Reviews;

