import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import baseUrl from "../services/Api";
import ProductCard from "../components/ProductCard";

function Products() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/product/category/${categoryId}`);
        setProducts(response.data ?? []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, [categoryId]); // 👈 لو دخلتي كاتيجوري تانية، يجيب منتجاتها من جديد

  return (
    <div className="container mt-4">
      <div className="row g-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Products;