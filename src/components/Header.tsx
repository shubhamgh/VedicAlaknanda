
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  X,
  Menu,
  Bed,
  Contact,
  Telescope,
  HandPlatter,
  Utensils,
  Calendar,
  Camera,
} from "lucide-react";
import Logo from "../assets/Logo.webp";

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const HeaderLinks = [
    { icon: <Bed />, link: "Rooms" },
    { icon: <Utensils />, link: "Dining" },
    { icon: <HandPlatter />, link: "Amenities" },
    { icon: <Camera />, link: "Gallery" },
    { icon: <Telescope />, link: "Explore" },
    { icon: <Contact />, link: "Contact" },
  ];

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
        "fixed w-full z-50 transition-all duration-700 ease-in-out",
        scrolled ? "opaque-header" : "transparent-header"
      )}
    >
      <div className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 md:gap-3">
          <img
            src={Logo}
            alt="Hotel Vedic Alaknanda Logo"
            className="h-8 w-8 md:h-10 md:w-10 object-contain"
          />
          <span
            className={`transition-colors duration-700 text-lg md:text-xl font-bold ${
              scrolled ? "text-hotel-dark" : "text-white"
            }`}
          >
            Hotel Vedic Alaknanda
          </span>
        </Link>

        <nav>
          <ul className="hidden md:flex space-x-4 lg:space-x-8 items-center">
            {HeaderLinks.map((item) => (
              <li key={item.link}>
                <Link
                  to={`/${item.link.toLowerCase()}`}
                  className={`text-sm uppercase tracking-wider font-medium hover:text-hotel-gold transition-colors touch-manipulation
                    ${scrolled ? "text-hotel-dark" : "text-white"}`}
                >
                  {item.link}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/book-now"
                className="bg-hotel-gold hover:bg-opacity-90 text-white py-2 px-3 lg:px-4 text-sm uppercase tracking-wider font-medium transition-all touch-manipulation"
              >
                Book Now
              </Link>
            </li>
          </ul>

          <button 
            className="md:hidden flex touch-manipulation p-2" 
            onClick={handleMenuClick}
            aria-label="Toggle menu"
          >
            <Menu
              className={`h-6 w-6 ${scrolled ? "text-hotel-dark" : "text-white"}`}
            />
          </button>
          
          {/* Mobile sidebar with better touch targets */}
          <div
            className={`fixed top-0 right-0 h-screen w-4/5 max-w-sm bg-white p-4 transform ${
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out md:hidden shadow-xl z-50`}
          >
            <button
              className="absolute top-4 right-4 p-2 touch-manipulation"
              onClick={handleCloseSidebar}
              aria-label="Close menu"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
            
            <ul className="flex flex-col gap-2 justify-center mt-16">
              <li>
                <Link
                  to="/book-now"
                  className="bg-hotel-gold hover:bg-opacity-90 text-white py-3 text-sm uppercase tracking-wider font-medium transition-all flex gap-2 items-center justify-center rounded-xl touch-manipulation"
                  onClick={handleCloseSidebar}
                >
                  <Calendar className="h-5 w-5" />
                  Book Now
                </Link>
              </li>
              {HeaderLinks.map((item) => (
                <li key={item.link} className="flex items-center">
                  <Link
                    to={`/${item.link.toLowerCase()}`}
                    className="text-lg font-bold text-gray-600 flex gap-3 items-center border-b border-gray-200 py-3 w-full touch-manipulation"
                    onClick={handleCloseSidebar}
                  >
                    <span className="h-5 w-5">{item.icon}</span>
                    {item.link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Overlay for mobile menu */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={handleCloseSidebar}
            />
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
