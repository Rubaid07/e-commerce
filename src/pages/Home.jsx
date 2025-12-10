// src/pages/Home.jsx
import { Link } from "react-router";
import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      {/* ------ Hero ------ */}
      <Hero />

      {/* ------ Featured ------ */}
     <FeaturedProducts />
    </div>
  );
};

export default Home;