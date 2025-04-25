import React, { useState, useEffect } from "react";
import "./Banner.css"; // Import the CSS file

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const bannerData = [
    { 
      image: "images/banner/b1.png", 
      welcome: "Welcome to Our World", 
      slogan: "Where Quality Meets Innovation" 
    },
    { 
      image: "images/banner/b2.png", 
      welcome: "Premium Selection", 
      slogan: "Crafted for Your Unique Style" 
    },
    { 
      image: "images/banner/b3.png", 
      welcome: "Exclusive Collection", 
      slogan: "Discover What Makes Us Different" 
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === bannerData.length - 1 ? 0 : prevSlide + 1
      );
    }, 6000); // 6 seconds per slide
    
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => 
      prevSlide === bannerData.length - 1 ? 0 : prevSlide + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => 
      prevSlide === 0 ? bannerData.length - 1 : prevSlide - 1
    );
  };

  return (
    <div className="banner-container">
      {bannerData.map((slide, index) => (
        <div 
          key={index}
          className={`banner-slide ${currentSlide === index ? 'active' : ''}`}
          style={{ 
            backgroundImage: `url(${slide.image})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="banner-content">
            <h1 className="banner-welcome">{slide.welcome}</h1>
            <p className="banner-slogan">{slide.slogan}</p>
            <button className="banner-btn">Explore Now</button>
          </div>
        </div>
      ))}

      <button className="arrow-btn prev-btn" onClick={prevSlide} aria-label="Previous slide">
        &#10094;
      </button>
      <button className="arrow-btn next-btn" onClick={nextSlide} aria-label="Next slide">
        &#10095;
      </button>

      <div className="dots-container">
        {bannerData.map((_, index) => (
          <button
            key={index}
            className={`dot ${currentSlide === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;