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

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const { products, loading, error } = useProducts();

  // Add console logs to debug
  console.log("URL ID parameter:", id);
  console.log("Products loaded:", products);
  
  useEffect(() => {
    if (products && products.length > 0) {
      // Try to find product both as string and integer ID
      let foundProduct = products.find(p => p.id === parseInt(id));
      
      // Additional fallback if that doesn't work
      if (!foundProduct) {
        foundProduct = products.find(p => String(p.id) === String(id));
      }
      
      console.log("Found product:", foundProduct);
      
      if (foundProduct) {
        setProduct(foundProduct);
      }
    }
  }, [products, id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return <div>Error loading product: {error}</div>;
  }

  // If product not found but products are loaded, show debugging info
  if (!product && products && products.length > 0) {
    console.log("Product not found. Available IDs:", products.map(p => p.id).join(", "));
    
    return (
      <div className="home-container">
        <Navbar />

        <div className="product-detail-page">
          <div className="product-detail-container">
            <div className="product-detail-left">
              <div className="placeholder-image">
                <p>Product ID {id} not found</p>
              </div>
            </div>
            <div className="product-detail-right">
              <h2 className="product-title">Book Not Found</h2>
              <p>We couldn't find a book with ID: {id}</p>
              <p>Available book IDs: {products.map(p => p.id).join(", ")}</p>
              
              <button className="buy-now" onClick={() => navigate("/")}>
                Return to Book List
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // If products array is empty or undefined but not loading, show no data message
  if (!product && !loading && (!products || products.length === 0)) {
    return (
      <div className="home-container">
        <Navbar />
        <div className="product-detail-page">
          <div className="error-container">
            <h2>No Books Available</h2>
            <p>No book data could be loaded from the database.</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Wait for product to be set
  if (!product) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
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

  // Random descriptions - one will be selected
  const bookDescriptions = [
    "This captivating book offers readers a unique perspective on life's challenges and rewards, inviting them to explore new ideas and perspectives.",
    "A masterful work that combines intricate storytelling with deep character development, keeping readers engaged from beginning to end.",
    "An immersive reading experience that transports you to another world, filled with vivid imagery and compelling narratives.",
    "This thought-provoking book challenges conventional wisdom and encourages readers to see the world through different lenses.",
    "A page-turner that combines suspense, emotion, and intellectual depth in perfect balance."
  ];

  // Random content summaries - one will be selected
  const contentSummaries = [
    "The story follows the protagonist through a series of unexpected events that challenge their beliefs and values, ultimately leading to profound personal growth and self-discovery.",
    "Set against a backdrop of historical significance, this book weaves together multiple storylines that converge in surprising and meaningful ways, exploring themes of love, loss, and redemption.",
    "An exploration of human nature and the complexities of relationships, this book delves into the choices we make and their lasting impact on our lives and the lives of those around us.",
    "The narrative unfolds across multiple perspectives, offering a rich tapestry of voices that collectively tell a story of courage, resilience, and the pursuit of truth in difficult circumstances.",
    "A journey through time and space that examines the connections between past, present, and future, challenging readers to reconsider their understanding of reality and possibility."
  ];

  // Select random description and summary (but consistently based on product ID)
  const descriptionIndex = Math.abs(product.id) % bookDescriptions.length;
  const summaryIndex = Math.abs(product.id + 2) % contentSummaries.length;

  return (
    <div className="home-container">
      <Navbar />

      <div className="product-detail-page">
        <div className="product-detail-container">
          <div className="product-detail-left">
            <img
              src={`/images/${product.image}`}
              alt={product.title}
              className="product-detail-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/placeholder.jpg";
                console.log("Image failed to load:", product.image);
              }}
            />
          </div>
          <div className="product-detail-right">
            <h2 className="product-title">{product.title}</h2>
            <p><strong>Author:</strong> {product.author}</p>
            <p><strong>Genre:</strong> {product.genre}</p>
            <p><strong>Price:</strong> {product.price.toLocaleString()} VND</p>
            {product.sale && (
              <p><strong>Sale Price:</strong> <span className="sale-price">{product.sale.toLocaleString()} VND</span></p>
            )}
            <p><strong>Description:</strong> {bookDescriptions[descriptionIndex]}</p>

            <div className="quantity-control">
              <button onClick={handleDecrease}><RemoveIcon /></button>
              <span>{quantity}</span>
              <button onClick={handleIncrease}><AddIcon /></button>
            </div>

            <div className="product-detail-buttons">
              <button className="buy-now" onClick={handleBuyNow}>Buy Now</button>
              <button className="add-to-cart" onClick={handleAddToCart}>
                <ShoppingCartIcon style={{ fontSize: 18 }} /> Add to Cart
              </button>
            </div>

            {added && (
              <div className="success-message">
                <CheckCircleIcon style={{ color: 'green' }} />
                Added to cart successfully!
              </div>
            )}
          </div>
        </div>

        <div className="product-summary">
          <h3>Content Summary</h3>
          <p>{contentSummaries[summaryIndex]}</p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;