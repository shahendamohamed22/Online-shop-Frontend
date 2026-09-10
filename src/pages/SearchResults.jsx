import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../services/axiosInstance";
import ProductCard from "../components/ProductCard";

function SearchResults() {
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = searchParams.get("keyword") ?? "";
    const [inputValue, setInputValue] = useState(keyword);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        setInputValue(keyword);
        
        const fetchResults = async () => {
            if (!keyword.trim()) {
                setProducts([]);
                return;
            }

            setLoading(true);
            try {
                const response = await axiosInstance.get(`/api/product/App/filter`, {
                    params: { SearchTerm: keyword },
                });
                setProducts(response.data ?? []);
            } catch (error) {
                console.log(error);
                if (error.response?.status === 401) {
                    toast.info("لا يمكن البحث حاليا");
                }
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [keyword]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        setSearchParams({ keyword: inputValue.trim() });
    };

    return (
        <div className="container mt-4">
            <form onSubmit={handleSubmit} className="input-group mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="ابحث عن منتج..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button className="btn btn-main rounded" type="submit">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
            </form>

            {keyword && <h2 className="mb-3 fs-5">نتائج البحث عن "{keyword}"</h2>}

            {loading ? (
                <p>جاري البحث...</p>
            ) : !keyword ? (
                <p className="text-muted">اكتب اسم منتج.</p>
            ) : products.length === 0 ? (
                <p>لا توجد نتائج مطابقة.</p>
            ) : (
                <div className="row g-3">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchResults;