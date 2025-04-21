import React, { useState, useEffect } from "react";
import "./product.css";

const Product = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from the API
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('http://localhost/PHP/orders_api.php', {
          method: 'GET',
          credentials: 'include', 
        });
        
        // Parse the JSON response
        const data = await response.json();
        
        if (data.success) {
          setItems(data.orders || []);
        } else {
          setError(data.error || 'Failed to load order data');
        }
      } catch (err) {
        console.error('Error fetching order data:', err);
        setError('Error connecting to the server. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []); // Empty dependency array means this runs once when component mounts

  // Render states
  if (loading) return <div className="m-5">Loading order information...</div>;
  if (error) return <div className="m-5 text-danger">Error: {error}</div>;
  if (items.length === 0) return <div className="m-5">No orders found.</div>;

  // Render the list of orders
  return (
    <div className="m-5 mt-0">
      <div className="product-header">Order Information</div>
      {items.map((item) => (
        <div
          key={`${item.id}-${item.order_id}`}
          className="row border-bottom border-1 border-dark mb-2 pb-2 justify-content-between align-items-center"
        >
          <div className="col-3">
            <img src={`/images/${item.image}`} alt={item.name} width="60px" height="92px" />
          </div>
          <div className="col">
            <div className="row">
              <div className="col-sm-6">
                <div><strong>{item.name}</strong></div>
                <div>{item.author}</div>
                <div><s>{item.price.toLocaleString('vi-VN')} vnd</s></div>
                <div><strong>{item.sale.toLocaleString('vi-VN')} vnd</strong></div>
              </div>
              <div className="col-sm-6">
                <div><strong>Status</strong></div>
                <div>{item.status || "Processing"}</div>
                <button className="btn btn-sm btn-outline-secondary mt-1">{item.form || "N/A"}</button>
                <div><strong>Quantity: {item.quantity}</strong></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Product;