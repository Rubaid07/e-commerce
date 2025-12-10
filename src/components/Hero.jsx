// src/components/Hero.jsx
import { Link } from "react-router";
// 💡 Lucide React icons imported
import { ArrowRight, Star, Truck, Shield } from "lucide-react"; 

const Hero = () => {
  const heroImg =
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1050&q=80";

  return (
    <div className="relative">
      {/* Hero Section */}
      <section
        className="relative h-[85vh] md:h-[90vh] bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        
        <div className="relative max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl text-white">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              🎉 Winter Sale: Up to 50% Off
            </span>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Elevate Your Style with{" "}
              <span className="text-amber-400">Premium</span> Fashion
            </h1>
            
            <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-xl">
              Discover curated collections of jackets, hoodies, and accessories 
              designed for comfort, style, and confidence in every season.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link to="/shop">
                <button className="group bg-amber-500 hover:bg-amber-600 text-black px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-amber-500/30">
                  Start Shopping
                  {/* 💡 Replaced FaArrowRight with ArrowRight */}
                  <ArrowRight className="group-hover:translate-x-1 transition-transform h-5 w-5" /> 
                </button>
              </Link>
              <Link to="/new-arrivals">
                <button className="group border-2 border-white/50 hover:border-white text-white px-8 py-4 rounded-lg font-bold text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  New Arrivals
                </button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    // 💡 Replaced FaStar with Star
                    <Star key={i} className="h-5 w-5 fill-amber-400 stroke-amber-400" /> 
                  ))}
                </div>
                <span className="text-sm">4.9/5 (10K+ Reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                {/* 💡 Replaced FaTruck with Truck */}
                <Truck className="h-5 w-5" /> 
                <span className="text-sm">Free Shipping Over $50</span>
              </div>
              <div className="flex items-center gap-2">
                {/* 💡 Replaced FaShieldAlt with Shield */}
                <Shield className="h-5 w-5" /> 
                <span className="text-sm">1-Year Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;