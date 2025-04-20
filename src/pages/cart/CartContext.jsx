import React, { createContext, useState, useContext, useEffect } from 'react';

// Create cart context
const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in and fetch cart from server
  useEffect(() => {
    const checkAuthAndLoadCart = async () => {
      try {
        setLoading(true);
        
        // Check if user is logged in by making a request to get current session
        const authResponse = await fetch('http://localhost/PHP/check_auth.php', {
          method: 'GET',
          credentials: 'include',
        });
        
        const authData = await authResponse.json();
        const userLoggedIn = authData.isLoggedIn || false;
        setIsLoggedIn(userLoggedIn);
        
        // If logged in, load cart from server
        if (userLoggedIn) {
          const cartResponse = await fetch('http://localhost/PHP/cart_api.php', {
            method: 'GET',
            credentials: 'include',
          });
          
          const cartData = await cartResponse.json();
          if (cartData.success && cartData.cart) {
            setCart(cartData.cart);
          }
        } else {
          // Load cart from localStorage for non-logged in users
          const savedCart = localStorage.getItem('guestCart');
          if (savedCart) {
            setCart(JSON.parse(savedCart));
          }
        }
      } catch (error) {
        console.error('Error checking auth or loading cart:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthAndLoadCart();
  }, []);
  
  // Save guest cart to localStorage when it changes
  useEffect(() => {
    if (!isLoggedIn && !loading) {
      localStorage.setItem('guestCart', JSON.stringify(cart));
    }
  }, [cart, isLoggedIn, loading]);

  // Function to handle user login - sync cart with server
  const handleLogin = async (userId) => {
    setIsLoggedIn(true);
    
    // Get current guest cart from localStorage
    const guestCart = [...cart];
    
    // If guest cart has items, sync with server
    if (guestCart.length > 0) {
      for (const item of guestCart) {
        await fetch('http://localhost/PHP/cart_api.php', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            book_id: item.id,
            quantity: item.quantity,
          }),
        });
      }
    }
    
    // Fetch updated cart from server
    const response = await fetch('http://localhost/PHP/cart_api.php', {
      method: 'GET',
      credentials: 'include',
    });
    
    const data = await response.json();
    if (data.success && data.cart) {
      setCart(data.cart);
    }
    
    // Clear localStorage cart
    localStorage.removeItem('guestCart');
  };

  // Function to handle user logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCart([]);
    localStorage.removeItem('guestCart');
  };

  // Function to add a product to the cart
  const addToCart = async (product, quantity = 1) => {
    // If logged in, add to server cart
    if (isLoggedIn) {
      try {
        const response = await fetch('http://localhost/PHP/cart_api.php', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            book_id: product.id,
            quantity: quantity,
          }),
        });
        
        const data = await response.json();
        if (data.success) {
          // Refresh cart from server to get updated data
          const cartResponse = await fetch('http://localhost/PHP/cart_api.php', {
            method: 'GET',
            credentials: 'include',
          });
          
          const cartData = await cartResponse.json();
          if (cartData.success && cartData.cart) {
            setCart(cartData.cart);
          }
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      // Otherwise, store in local state
      setCart((prevCart) => {
        const existingProduct = prevCart.find(item => item.id === product.id);
        if (existingProduct) {
          return prevCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevCart, { ...product, quantity }];
      });
    }
  };

  // Function to update the quantity of a product
  const updateQuantity = async (id, delta) => {
    if (isLoggedIn) {
      try {
        // Find product in cart to get current quantity
        const product = cart.find(item => item.id === id);
        if (!product) return;
        
        const newQuantity = Math.max(1, product.quantity + delta);
        
        const response = await fetch('http://localhost/PHP/cart_api.php', {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            book_id: id,
            quantity: newQuantity,
          }),
        });
        
        const data = await response.json();
        if (data.success) {
          // Update local cart state
          setCart(prevCart => 
            prevCart.map(item => 
              item.id === id ? { ...item, quantity: newQuantity } : item
            )
          );
        }
      } catch (error) {
        console.error('Error updating cart quantity:', error);
      }
    } else {
      // Update local cart state
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        )
      );
    }
  };

  // Function to remove a product from the cart
  const removeFromCart = async (id) => {
    if (isLoggedIn) {
      try {
        const response = await fetch('http://localhost/PHP/cart_api.php', {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            book_id: id,
          }),
        });
        
        const data = await response.json();
        if (data.success) {
          // Update local cart state
          setCart(prevCart => prevCart.filter(item => item.id !== id));
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    } else {
      // Update local cart state
      setCart(prevCart => prevCart.filter(item => item.id !== id));
    }
  };
  
  // Function to checkout
  const checkout = async () => {
    if (isLoggedIn) {
      try {
        const response = await fetch('http://localhost/PHP/checkout_api.php', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // Include any additional checkout data here
          }),
        });
        
        const data = await response.json();
        if (data.success) {
          // Clear local cart after successful checkout
          setCart([]);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error during checkout:', error);
        return false;
      }
    } else {
      // For non-logged in users, just show success for demo
      // In a real app, this would redirect to login or handle guest checkout
      return true;
    }
  };

  // Provide cart context values
  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        checkout, 
        handleLogin, 
        handleLogout,
        isLoggedIn,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};