import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { Mail, MapPin, Phone, Instagram } from "lucide-react";

const BookNow = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section */}

      <HeroSection
        title="Book Your Stay"
        description="Reserve your perfect mountain getaway"
      />

      <main className="container mx-auto px-4 py-8 md:py-20 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 py-4 md:py-8">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold">
              For all your booking needs you can contact us on the following
              places:
            </h2>
          </div>
          <div>
            <ul className="space-y-4 md:space-y-6">
              <li className="flex items-start">
                <a
                  href="https://maps.app.goo.gl/45dNGCTWWUx1uzxx8"
                  target="_blank"
                  className="flex items-start touch-manipulation"
                >
                  <MapPin className="mr-3 h-5 w-5 text-hotel-gold flex-shrink-0 mt-1" />
                  <span className="hover:text-hotel-gold transition-colors text-sm md:text-base">
                    Hotel Vedic Alaknanda, Narkota
                    <br />
                    Rudraprayag, Uttarakhand 246171
                  </span>
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="mr-3 h-5 w-5 text-hotel-gold flex-shrink-0 mt-1" />
                <div className="flex flex-col space-y-1">
                  <a
                    href="tel:+918267020926"
                    className="hover:text-hotel-gold transition-colors text-sm md:text-base touch-manipulation"
                  >
                    +91 8267 020 926
                  </a>
                  <a
                    href="tel:+919815812309"
                    className="hover:text-hotel-gold transition-colors text-sm md:text-base touch-manipulation"
                  >
                    +91 98158 123 09
                  </a>
                </div>
              </li>
              <li className="flex items-center">
                <Instagram className="mr-3 h-5 w-5 text-hotel-gold flex-shrink-0" />
                <a
                  href="https://www.instagram.com/vedic.alaknanda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-hotel-gold transition-colors text-sm md:text-base touch-manipulation"
                >
                  @vedic.alaknanda
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-hotel-gold flex-shrink-0" />
                <a
                  href="mailto:booking@vedicalaknanda.com"
                  className="hover:text-hotel-gold transition-colors text-sm md:text-base touch-manipulation break-all"
                >
                  booking@VedicAlaknanda.com
                </a>
              </li>
              <li className="flex items-center">
                <a
                  href="https://www.booking.com/hotel/in/vedic-alaknanda-seva-sadan.en-gb.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-5 w-5 flex touch-manipulation"
                >
                  <p className="text-hotel-gold font-bold mr-3 px-1 h-5 w-5 text-lg md:text-xl flex items-center">
                    B.
                  </p>
                  <span className="hover:text-hotel-gold transition-colors text-sm md:text-base">
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
