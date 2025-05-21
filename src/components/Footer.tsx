import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Compass } from "lucide-react";
import BookingIcon from "../assets/bookingcom.svg";

const Footer: React.FC = () => {
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
                className="text-white hover:text-hotel-gold transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://x.com/VedicAlaknanda"
                target="_blank"
                className="text-white hover:text-hotel-gold transition-colors"
              >
                <span className="sr-only">Twitter</span>
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
                href="https://www.booking.com/hotel/in/vedic-alaknanda-seva-sadan.en-gb.html"
                target="_blank"
                rel="noopener noreferrer"
                className="h-5 w-5 text-hotel-gold"
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
                <a
                  href="tel:+918267020926"
                  className="hover:text-hotel-gold transition-colors"
                >
                  +91 8267 020 926
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-hotel-gold" />
                <a
                  href="mailto:vedicalaknanda@gmail.com"
                  className="hover:text-hotel-gold transition-colors"
                >
                  VedicAlaknanda@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                "About Us",
                "Rooms",
                "Dining",
                // "Events",
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
            <form className="mb-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-2 w-full text-gray-800 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-hotel-gold hover:bg-opacity-90 px-4 py-2 text-white"
                >
                  Send
                </button>
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
              {/* </a> */}
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
            {/* <Link
              to="/privacy-policy"
              className="hover:text-hotel-gold transition-colors"
            >
              Privacy Policy
            </Link>{" "} */}
            <Link to={"/admin"}>|</Link>
            {/* <Link
              to="/terms"
              className="hover:text-hotel-gold transition-colors ml-2"
            >
              Terms of Service
            </Link> */}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
