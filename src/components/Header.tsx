import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <header
      className={cn(
        "fixed w-full z-50 transition-all duration-300 ease-in-out",
        scrolled ? "opaque-header" : "transparent-header"
      )}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          <span
            className={`transition-colors duration-300 ${
              scrolled ? "text-hotel-dark" : "text-white"
            }`}
          >
            Hotel Vedic Alaknanda
          </span>
        </Link>

        <nav>
          <ul className="hidden md:flex space-x-8 items-center">
            {["Rooms", "Dining", "Amenities", "Explore", "Contact"].map(
              (item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className={`text-sm uppercase tracking-wider font-medium hover:text-hotel-gold transition-colors
                    ${scrolled ? "text-hotel-dark" : "text-white"}`}
                  >
                    {item}
                  </Link>
                </li>
              )
            )}
            <li>
              <Link
                to="/book-now"
                className="bg-hotel-gold hover:bg-opacity-90 text-white py-2 px-4 text-sm uppercase tracking-wider font-medium transition-all"
              >
                Book Now
              </Link>
            </li>
          </ul>

          <button className="md:hidden">
            {/* Mobile menu button, we'll implement this in a later iteration */}
            <span className={`${scrolled ? "text-hotel-dark" : "text-white"}`}>
              Menu
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
