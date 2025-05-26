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
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={Logo}
            alt="Hotel Vedic Alaknanda Logo"
            className="h-10 w-10 object-contain"
          />
          <span
            className={`transition-colors duration-700 text-xl font-bold ${
              scrolled ? "text-hotel-dark" : "text-white"
            }`}
          >
            Hotel Vedic Alaknanda
          </span>
        </Link>

        <nav>
          <ul className="hidden md:flex space-x-8 items-center">
            {HeaderLinks.map((item) => (
              <li key={item.link}>
                <Link
                  to={`/${item.link.toLowerCase()}`}
                  className={`text-sm uppercase tracking-wider font-medium hover:text-hotel-gold transition-colors
                    ${scrolled ? "text-hotel-dark" : "text-white"}`}
                >
                  {item.link}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/book-now"
                className="bg-hotel-gold hover:bg-opacity-90 text-white py-2 px-4 text-sm uppercase tracking-wider font-medium transition-all"
              >
                Book Now
              </Link>
            </li>
          </ul>

          <button className="md:hidden flex" onClick={handleMenuClick}>
            <Menu
              className={`${scrolled ? "text-hotel-dark" : "text-white"}`}
            />
          </button>
          <div
            className={`fixed top-0 right-0 h-screen w-3/4 bg-white p-4 transform ${
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out md:hidden`}
          >
            <button
              className="absolute top-4 right-4"
              onClick={handleCloseSidebar}
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
            {/* Sidebar content here */}
            <ul className="flex flex-col gap-4 justify-center">
              <li>
                <Link
                  to="/book-now"
                  className="bg-hotel-gold hover:bg-opacity-90 text-white py-2 text-sm uppercase tracking-wider font-medium transition-all flex gap-2 items-center justify-center rounded-xl mt-8"
                >
                  <Calendar />
                  Book Now
                </Link>
              </li>
              {HeaderLinks.map((item) => (
                <li key={item.link} className="flex items-center space-x-4">
                  <Link
                    to={`/${item.link.toLowerCase()}`}
                    className="text-lg font-bold text-gray-600 flex gap-2 items-center border-b border-gray-200 py-2"
                  >
                    {item.icon}
                    {item.link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
