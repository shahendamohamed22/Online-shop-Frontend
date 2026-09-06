import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import ProductCard from "../components/ProductCard";

function Products() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoryRes, productsRes] = await Promise.all([
          axiosInstance.get(`/api/category/${categoryId}`),
          axiosInstance.get(`/api/product`),
        ]);

        const catName = categoryRes.data?.name;
        setCategoryName(catName ?? "");

        // /api/product/category/:id مكسور على السيرفر دلوقتي (بيرجع 404 حتى لو فيه منتجات)
        // فبنجيب كل المنتجات ونفلتر بالاسم بدل ما نعتمد عليه
        const filtered = (productsRes.data ?? []).filter(
          (p) => p.categoryName === catName
        );
        setProducts(filtered);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  if (loading) return <p className="container mt-4">جاري التحميل...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3 badge bg-main fs-3">{categoryName}</h2>
      <div className="row g-3">
        {products.length === 0 ? (
          <p>لا توجد منتجات في هذا القسم حاليًا.</p>
        ) : (
          products.map((product) => <ProductCard key={product.id} product={product} />)
        )}
      </div>
    </div>
  );
}

export default Products;