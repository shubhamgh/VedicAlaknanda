import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import BookingIcon from "../assets/bookingcom.svg";
import { Mail, MapPin, Phone } from "lucide-react";

const BookNow = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-8">Book Your Stay</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <h2>
            For all your booking needs you can contact us on the following
            places:
          </h2>
          <div>
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
                  href="tel:+919815812309"
                  className="hover:text-hotel-gold transition-colors"
                >
                  +91 98158 123 09
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
              <li className="flex items-center">
                <a
                  href="https://www.booking.com/hotel/in/vedic-alaknanda-seva-sadan.en-gb.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-5 w-5 flex"
                >
                  <p className="text-hotel-gold font-bold mr-3 px-1 h-5 w-5 text-xl flex items-center">
                    B
                  </p>
                  <span className="hover:text-hotel-gold transition-colors">
                    Booking.com
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookNow;
