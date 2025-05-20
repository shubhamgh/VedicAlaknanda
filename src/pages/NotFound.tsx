
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center bg-gray-100 px-4 py-32">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-hotel-dark mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">
            We can't seem to find the page you're looking for
          </p>
          <Link
            to="/"
            className="bg-hotel-gold hover:bg-opacity-90 text-white py-3 px-8 inline-block text-base uppercase tracking-wider font-medium transition-all"
          >
            Return to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
