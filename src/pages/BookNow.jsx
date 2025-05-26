import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Mail, MapPin, Phone, Instagram } from "lucide-react";

const BookNow = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-hotel-dark to-hotel-gold flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Book Your Stay
          </h1>
          <p className="text-lg md:text-xl">
            Reserve your perfect mountain getaway
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-20 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
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
                  href="tel:+918267020926"
                  className="hover:text-hotel-gold transition-colors"
                >
                  +91 8267 020 926
                </a>
              </li>
              <li className="flex items-center">
                <Instagram className="mr-3 h-5 w-5 text-hotel-gold" />
                <a
                  href="https://www.instagram.com/vedic.alaknanda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-hotel-gold transition-colors"
                >
                  @vedic.alaknanda
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
                    B.
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
