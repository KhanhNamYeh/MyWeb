import { useState, useEffect } from 'react';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost/PHP/get_books.php", {
          method: "GET",
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.books);
        } else {
          throw new Error(data.error || 'Failed to fetch books');
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        setError(error.message);
        setProducts([]); // Set empty array if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

// Default export for simpler imports
export default useProducts;