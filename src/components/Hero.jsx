// src/components/Hero.jsx
import { Link } from "react-router";
import { ArrowRight, Star, Truck, Shield } from "lucide-react"; 

const Hero = () => {
  const heroImg =
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1050&q=80";

  return (
    <div className="relative">
      {/* Hero Section */}
      <section
        className="relative h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh] bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        
        <div className="relative lg:max-w-10/12 mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full">
          <div className="max-w-full sm:max-w-4xl text-white">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
              🎉 Winter Sale: Up to 50% Off
            </span>
            
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              Elevate Your Style with{" "}
              <span className="text-amber-400">Premium</span> Fashion
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 text-gray-200 max-w-full sm:max-w-xl">
              Discover curated collections of jackets, hoodies, and accessories 
              designed for comfort, style, and confidence in every season.
            </p>
            
            <div className="flex gap-3 sm:gap-4 mb-8 sm:mb-10">
              <Link to="/shop" className="">
                <button className="group bg-amber-500 hover:bg-amber-600 text-black px-4 sm:px-8 py-2 sm:py-4 rounded-lg font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-amber-500/30 ">
                  Start Shopping
                  <ArrowRight className="group-hover:translate-x-1 transition-transform h-4 w-4 sm:h-5 sm:w-5" /> 
                </button>
              </Link>
              <Link to="/new-arrivals" className="">
                <button className="group border-2 border-white/50 hover:border-white text-white px-4 sm:px-8 py-2 sm:py-4 rounded-lg font-bold text-base sm:text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  New Arrivals
                </button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex flex-col xs:flex-row flex-wrap gap-3 xs:gap-4 sm:gap-6 md:gap-8">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 fill-amber-400 stroke-amber-400" /> 
                  ))}
                </div>
                <span className="text-xs sm:text-sm">4.9/5 <span className="hidden sm:inline">(10K+ Reviews)</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5" /> 
                <span className="text-xs sm:text-sm">Free Shipping <span className="hidden xs:inline">Over $50</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5" /> 
                <span className="text-xs sm:text-sm">1-Year Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden sm:block absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-2 sm:h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;