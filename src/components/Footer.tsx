import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Compass,
  Instagram,
  Youtube,
} from "lucide-react";
import BookingIcon from "../assets/bookingcom.svg";
import { useNewsletter } from "@/hooks/useNewsletter";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const { loading, subscribeToNewsletter } = useNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await subscribeToNewsletter(email)) {
      setEmail("");
    }
  };

  return (
    <footer className="bg-hotel-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Hotel Vedic Alaknanda</h3>
            <p className="text-hotel-accent mb-6">
              Experience comfort and tranquility on the sacred route to
              Kedarnath & Badrinath.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/vedic.alaknanda"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-hotel-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://x.com/VedicAlaknanda"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-hotel-gold transition-colors"
                aria-label="Twitter"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/channel/UCxv6Y2Kfnq0VDd5cnQbQECQ"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-hotel-gold transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-6 h-6" />
              </a>
              <a
                href="https://www.booking.com/hotel/in/vedic-alaknanda-seva-sadan.en-gb.html"
                target="_blank"
                rel="noopener noreferrer"
                className="h-5 w-5 text-hotel-gold"
                aria-label="Booking.com"
              >
                <img src={BookingIcon} alt="" />
              </a>
            </div>
          </div>

          {/* Column 2 - Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <a
                  href="https://maps.app.goo.gl/45dNGCTWWUx1uzxx8"
                  target="_blank"
                  className="flex items-start"
                >
                  <MapPin className="mr-3 h-5 w-5 text-hotel-gold" />
                  <span className="hover:text-hotel-gold transition-colors">
                    Hotel Vedic Alaknanda, Narkota
                    <br />
                    Rudraprayag, Uttarakhand 246171
                  </span>
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 h-5 w-5 text-hotel-gold" />
                <span className="flex flex-col">
                  <a
                    href="tel:+918267020926"
                    className="hover:text-hotel-gold transition-colors"
                  >
                    +91 8267 020 926
                  </a>
                  <a
                    href="tel:+919815812309"
                    className="hover:text-hotel-gold transition-colors"
                  >
                    +91 98158 123 09
                  </a>
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-hotel-gold" />
                <a
                  href="mailto:contact@vedicalaknanda.com"
                  className="hover:text-hotel-gold transition-colors"
                >
                  contact@VedicAlaknanda.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                "Rooms",
                "Dining",
                // "Events",
                "Gallery",
                "Amenities",
                "Explore",
                "Contact",
                // "Gallery",
                // "Offers",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="hover:text-hotel-gold transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Subscribe */}
          <div>
            <h3 className="text-xl font-bold mb-4">Subscribe</h3>
            <p className="text-hotel-accent mb-4">
              Subscribe to our newsletter for special offers and updates
            </p>
            <form className="mb-4" onSubmit={handleSubmit}>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-2 w-full text-gray-800 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  className="bg-hotel-gold hover:bg-opacity-90 px-4 py-2 text-white"
                  disabled={loading}
                >
                  {loading ? "..." : "Send"}
                </Button>
              </div>
            </form>
            <a
              href="https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUqCAgCEEUYJxg7MgYIABBFGDkyBggBEEUYPTIICAIQRRgnGDsyCAgDEEUYJxg7MgoIBBAuGLEDGIAEMgYIBRBFGD0yBggGEEUYPDIGCAcQLhhA0gEINDExOGowajGoAgiwAgHxBQ7_Xl6SoaqP&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KZ-mChzvtwk5MbIW4s-ZVbOU&daddr=Narkota,+Devimanda,+Uttarakhand+246171"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Compass className="mr-2 h-5 w-5 text-hotel-gold" />
              <p className="text-sm">Find directions to our hotel</p>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center md:text-left md:flex md:justify-between text-sm text-hotel-accent">
          <p>
            © {new Date().getFullYear()} Hotel Vedic Alaknanda. All rights
            reserved.
          </p>
          <p className="mt-2 md:mt-0">
            <Link to={"/admin"}>|</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
