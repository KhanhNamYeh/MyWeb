import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products } from "./../cart/component/product_Data";
import Navbar from "../HeadAndFooter/Navbar";
import Footer from "../HeadAndFooter/Footer";
import { useCart } from "../cart/CartContext";
import "./productDetail.css";

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';



const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return <div>Sản phẩm không tồn tại.</div>;
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate("/cart");
  };

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <>
      <Navbar />

      <div className="product-detail-page">
        <div className="product-detail-container">
          <div className="product-detail-left">
            <img
              src={`/images/${product.image}`}
              alt={product.title}
              className="product-detail-image"
            />
          </div>
          <div className="product-detail-right">
            <h2 className="product-title">{product.title}</h2>
            <p><strong>Tác giả:</strong> {product.author}</p>
            <p><strong>Thể loại:</strong> {product.genre}</p>
            <p><strong>Giá:</strong> {product.price.toLocaleString()} đ</p>
            <p><strong>Mô tả:</strong> Sách này rất hấp dẫn và thú vị...</p>

            <div className="quantity-control">
              <button onClick={handleDecrease}><RemoveIcon /></button>
              <span>{quantity}</span>
              <button onClick={handleIncrease}><AddIcon /></button>
            </div>

            <div className="product-detail-buttons">
              <button className="buy-now" onClick={handleBuyNow}>Mua ngay</button>
              <button className="add-to-cart" onClick={handleAddToCart}>
                <ShoppingCartIcon style={{ fontSize: 18 }} /> Thêm vào giỏ hàng
              </button>
            </div>

            {added && (
              <div className="success-message">
                <CheckCircleIcon style={{ color: 'green' }} />
                Đã thêm vào giỏ hàng thành công!
              </div>
            )}
          </div>
        </div>

        <div className="product-summary">
          <h3>Tóm tắt nội dung</h3>
          <p>
            Cuốn sách kể về hành trình đầy cảm hứng của nhân vật chính, vượt qua những khó khăn, thử thách để đạt được ước mơ. Tác phẩm mang lại nhiều bài học sâu sắc và giá trị về cuộc sống.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetail;
