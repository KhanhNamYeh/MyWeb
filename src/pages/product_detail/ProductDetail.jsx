import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../cart/component/product_Data";
import Navbar from "../HeadAndFooter/Navbar";
import Footer from "../HeadAndFooter/Footer";
import { useCart } from "../cart/CartContext";
import "./productDetail.css";

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StarsIcon from '@mui/icons-material/Stars';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const { products, loading, error } = useProducts();
  const [activeTab, setActiveTab] = useState('description');
  
  useEffect(() => {
    if (products && products.length > 0) {
      let foundProduct = products.find(p => p.id === parseInt(id));
      
      if (!foundProduct) {
        foundProduct = products.find(p => String(p.id) === String(id));
      }
      
      if (foundProduct) {
        setProduct(foundProduct);
      }
    }
    
    // Scroll to top when component loads
    window.scrollTo(0, 0);
  }, [products, id]);

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="product-detail-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return <div className="product-detail-error">Error loading product: {error}</div>;
  }

  if (!product && products && products.length > 0) {
    return (
      <div className="product-detail-wrapper">
        <Navbar />

        <div className="product-detail-page">
          <div className="product-detail-breadcrumb">
            <button onClick={() => navigate("/")} className="product-detail-back-button">
              <ArrowBackIcon /> Back to Books
            </button>
          </div>
          
          <div className="product-detail-container product-detail-not-found">
            <div className="product-detail-left">
              <div className="product-detail-placeholder">
                <p>Product ID {id} not found</p>
              </div>
            </div>
            <div className="product-detail-right">
              <h2 className="product-detail-title">Book Not Found</h2>
              <p className="product-detail-message">We couldn't find a book with ID: {id}</p>
              <p className="product-detail-available-ids">Available book IDs: {products.map(p => p.id).join(", ")}</p>
              
              <button className="product-detail-return-button" onClick={() => navigate("/")}>
                Return to Book List
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (!product && !loading && (!products || products.length === 0)) {
    return (
      <div className="product-detail-wrapper">
        <Navbar />
        <div className="product-detail-page">
          <div className="product-detail-error-container">
            <h2>No Books Available</h2>
            <p>No book data could be loaded from the database.</p>
            <button className="product-detail-retry-button" onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-loading">
        <div className="product-detail-spinner"></div>
        <p>Finding book details...</p>
      </div>
    );
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

  // Book descriptions and summaries
  const bookDescriptions = [
    "This captivating book offers readers a unique perspective on life's challenges and rewards, inviting them to explore new ideas and perspectives.",
    "A masterful work that combines intricate storytelling with deep character development, keeping readers engaged from beginning to end.",
    "An immersive reading experience that transports you to another world, filled with vivid imagery and compelling narratives.",
    "This thought-provoking book challenges conventional wisdom and encourages readers to see the world through different lenses.",
    "A page-turner that combines suspense, emotion, and intellectual depth in perfect balance."
  ];

  const contentSummaries = [
    "The story follows the protagonist through a series of unexpected events that challenge their beliefs and values, ultimately leading to profound personal growth and self-discovery.",
    "Set against a backdrop of historical significance, this book weaves together multiple storylines that converge in surprising and meaningful ways, exploring themes of love, loss, and redemption.",
    "An exploration of human nature and the complexities of relationships, this book delves into the choices we make and their lasting impact on our lives and the lives of those around us.",
    "The narrative unfolds across multiple perspectives, offering a rich tapestry of voices that collectively tell a story of courage, resilience, and the pursuit of truth in difficult circumstances.",
    "A journey through time and space that examines the connections between past, present, and future, challenging readers to reconsider their understanding of reality and possibility."
  ];

  // Select random description and summary based on product ID
  const descriptionIndex = Math.abs(product.id) % bookDescriptions.length;
  const summaryIndex = Math.abs(product.id + 2) % contentSummaries.length;
  
  // Calculate discount percentage if applicable
  const discountPercentage = product.sale && product.price > product.sale 
    ? Math.round(((product.price - product.sale) / product.price) * 100) 
    : null;

  return (
    <div className="product-detail-wrapper">
      <Navbar />

      <div className="product-detail-page">
        <div className="product-detail-breadcrumb">
          <button onClick={() => navigate("/")} className="product-detail-back-button">
            <ArrowBackIcon /> Back to Books
          </button>
        </div>

        <div className="product-detail-container">
          <div className="product-detail-left">
            <div className="product-detail-image-container">
              {discountPercentage && (
                <div className="product-detail-discount-badge">
                  -{discountPercentage}%
                </div>
              )}
              <img
                src={`/images/${product.image}`}
                alt={product.title}
                className="product-detail-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/placeholder.jpg";
                }}
              />
            </div>
          </div>
          <div className="product-detail-right">
            <h1 className="product-detail-title">{product.title}</h1>
            
            <div className="product-detail-author"><span>{product.author}</span></div>
            
            <div className="product-detail-badge-container">
              <span className="product-detail-genre-badge">{product.genre}</span>
              <span className="product-detail-rating-badge">
                <StarsIcon style={{ fontSize: 16 }} /> 4.5/5
              </span>
            </div>
            
            <div className="product-detail-price-container">
              {product.sale ? (
                <>
                  <span className="product-detail-original-price">{product.price.toLocaleString()} VND</span>
                  <span className="product-detail-sale-price">{product.sale.toLocaleString()} VND</span>
                </>
              ) : (
                <span className="product-detail-regular-price">{product.price.toLocaleString()} VND</span>
              )}
            </div>
            
            <div className="product-detail-divider"></div>
            
            <div className="product-detail-shipping-info">
              <LocalShippingIcon style={{ fontSize: 18 }} />
              <span>Free shipping for orders over 200,000 VND</span>
            </div>
            
            <div className="product-detail-quantity-section">
              <p className="product-detail-quantity-label">Quantity:</p>
              <div className="product-detail-quantity-control">
                <button 
                  className="product-detail-quantity-button" 
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                >
                  <RemoveIcon />
                </button>
                <span className="product-detail-quantity-value">{quantity}</span>
                <button 
                  className="product-detail-quantity-button" 
                  onClick={handleIncrease}
                >
                  <AddIcon />
                </button>
              </div>
            </div>

            <div className="product-detail-actions">
              <button className="product-detail-buy-button" onClick={handleBuyNow}>
                Buy Now
              </button>
              <button className="product-detail-cart-button" onClick={handleAddToCart}>
                <ShoppingCartIcon style={{ fontSize: 18 }} /> 
                Add to Cart
              </button>
              <button className="product-detail-wishlist-button">
                <BookmarkIcon style={{ fontSize: 18 }} />
              </button>
            </div>

            {added && (
              <div className="product-detail-success-message">
                <CheckCircleIcon style={{ color: 'green' }} />
                Added to cart successfully!
              </div>
            )}
          </div>
        </div>

        <div className="product-detail-info-tabs">
          <div className="product-detail-tab-header">
            <button 
              className={`product-detail-tab ${activeTab === 'description' ? 'product-detail-tab-active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`product-detail-tab ${activeTab === 'summary' ? 'product-detail-tab-active' : ''}`}
              onClick={() => setActiveTab('summary')}
            >
              Content Summary
            </button>
            <button 
              className={`product-detail-tab ${activeTab === 'reviews' ? 'product-detail-tab-active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>
          
          <div className="product-detail-tab-content">
            {activeTab === 'description' && (
              <div className="product-detail-description">
                <p>{bookDescriptions[descriptionIndex]}</p>
                <ul className="product-detail-book-details">
                  <li><strong>Format:</strong> Paperback</li>
                  <li><strong>Language:</strong> Vietnamese</li>
                  <li><strong>Pages:</strong> {Math.floor(Math.random() * 300) + 150}</li>
                  <li><strong>Publisher:</strong> Literature Publishing House</li>
                  <li><strong>ISBN:</strong> 978-{Math.floor(Math.random() * 9000000) + 1000000}-{Math.floor(Math.random() * 90) + 10}-{Math.floor(Math.random() * 9)}</li>
                </ul>
              </div>
            )}
            
            {activeTab === 'summary' && (
              <div className="product-detail-summary">
                <p>{contentSummaries[summaryIndex]}</p>
                <p>This book will appeal to readers who enjoy thoughtful narratives that challenge conventional thinking and offer new perspectives on familiar themes.</p>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="product-detail-reviews">
                <div className="product-detail-review-summary">
                  <div className="product-detail-rating">
                    <h3>4.5</h3>
                    <div className="product-detail-stars">★★★★½</div>
                    <p>Based on 24 reviews</p>
                  </div>
                  <div className="product-detail-rating-bars">
                    <div className="product-detail-rating-bar">
                      <span>5 ★</span>
                      <div className="product-detail-progress-container">
                        <div className="product-detail-progress" style={{ width: '70%' }}></div>
                      </div>
                      <span>70%</span>
                    </div>
                    <div className="product-detail-rating-bar">
                      <span>4 ★</span>
                      <div className="product-detail-progress-container">
                        <div className="product-detail-progress" style={{ width: '20%' }}></div>
                      </div>
                      <span>20%</span>
                    </div>
                    <div className="product-detail-rating-bar">
                      <span>3 ★</span>
                      <div className="product-detail-progress-container">
                        <div className="product-detail-progress" style={{ width: '5%' }}></div>
                      </div>
                      <span>5%</span>
                    </div>
                    <div className="product-detail-rating-bar">
                      <span>2 ★</span>
                      <div className="product-detail-progress-container">
                        <div className="product-detail-progress" style={{ width: '3%' }}></div>
                      </div>
                      <span>3%</span>
                    </div>
                    <div className="product-detail-rating-bar">
                      <span>1 ★</span>
                      <div className="product-detail-progress-container">
                        <div className="product-detail-progress" style={{ width: '2%' }}></div>
                      </div>
                      <span>2%</span>
                    </div>
                  </div>
                </div>
                <p className="product-detail-no-reviews">Be the first to review this book!</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="product-detail-related">
          <h3 className="product-detail-section-title">You May Also Like</h3>
          <div className="product-detail-related-grid">
            {products && products.filter(p => p.genre === product.genre && p.id !== product.id)
              .slice(0, 4).map(relatedProduct => (
                <div 
                  key={relatedProduct.id} 
                  className="product-detail-related-item"
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                >
                  <img 
                    src={`/images/${relatedProduct.image}`} 
                    alt={relatedProduct.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/placeholder.jpg";
                    }}
                  />
                  <div className="product-detail-related-info">
                    <h4>{relatedProduct.title}</h4>
                    <p>{relatedProduct.price.toLocaleString()} VND</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;