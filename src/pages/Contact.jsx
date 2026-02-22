import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Map, Phone, Mail, Clock, Send } from "lucide-react";
import { useContact } from "@/hooks/useContact";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const { submitContactForm, isSubmitting } = useContact();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await submitContactForm(formData);

    if (success) {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }
  };

  return (
    <main className="min-h-screen">
      <Header />

      <HeroSection
        title="Contact Us"
        description="Reach out to us for any inquiries or assistance"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div>
            <Card className="h-full">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-6">Reach Us</h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <Map className="h-5 w-5 mr-3 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-gray-600 mt-1">
                        Hotel Vedic Alaknanda
                        <br />
                        Rudraprayag (Narkota)
                        <br />
                        Uttarakhand, India
                      </p>
                    </div>
                  </div>

                  <a href="tel:+918267020926" className="flex items-start">
                    <Phone className="h-5 w-5 mr-3 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-gray-600 mt-1 flex flex-col">
                        <a
                          href="tel:+918267020926"
                          className="hover:text-blue-600 transition-colors"
                        >
                          +91 82670 20926
                        </a>
                        <a
                          href="tel:+919815812309"
                          className="hover:text-blue-600 transition-colors"
                        >
                          +91 98158 123 09
                        </a>
                      </p>
                    </div>
                  </a>

                  <a
                    href="mailto:contact@vedicalaknanda.com"
                    className="flex items-start"
                  >
                    <Mail className="h-5 w-5 mr-3 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600 mt-1">
                        <div className="hover:text-blue-600 transition-colors">
                          contact@VedicAlaknanda.com
                        </div>
                      </p>
                    </div>
                  </a>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-3 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Hours</h3>
                      <p className="text-gray-600 mt-1">
                        Reception: 24/7
                        <br />
                        Check-in: 24/7
                        <br />
                        Check-out: 10:00 AM
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="h-full">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-6">
                  Send Us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-1"
                    >
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-1"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium mb-1"
                    >
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Enter subject"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-1"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Enter your message"
                      rows={5}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map + Getting Here Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {/* Getting Here */}
          <Card className="shadow-md">
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-2xl font-semibold mb-4">🗺️ How to Reach</h2>
              <p>
                Hotel Vedic Alaknanda is nestled on the scenic Badrinath Highway
                in Narkota, just 4 km before Rudraprayag when coming from
                Rishikesh/Dehradun. Located right by the Alaknanda River and
                surrounded by lush Himalayan valleys, our hotel is a peaceful
                stopover for pilgrims and travelers headed to Sri Kedarnath and
                Sri Badrinath Dham.
              </p>
              <p className="font-medium text-gray-800">
                📍 Ideal for guests looking to stay close to nature while on the
                Char Dham Yatra route.
              </p>

              <div>
                <h3 className="font-semibold text-gray-900">
                  🚗 Getting There
                </h3>
                <p className="text-gray-700">
                  Rudraprayag is a key junction town that separates the roadways
                  leading to Kedarnath and Badrinath. The sacred confluence of
                  the Alaknanda and Mandakini rivers lies just a few kilometers
                  from our hotel.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">✈️ By Air:</h3>
                <p className="text-gray-700">
                  <strong>Nearest Airport:</strong> Jolly Grant Airport,
                  Dehradun – approx. 140 km
                  <br />
                  Regular flights operate from Delhi, Mumbai, Bengaluru,
                  Lucknow, and other cities via IndiGo, Air India, SpiceJet, and
                  more.
                  <br />
                  Taxis and buses are readily available from the airport to
                  Rishikesh, Devprayag, Srinagar, and Rudraprayag.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">🚉 By Train:</h3>
                <p className="text-gray-700">
                  <strong>Nearest Railway Station:</strong> Rishikesh – approx.
                  130 km
                  <br />
                  Rishikesh is well-connected to Haridwar, Delhi, and other
                  major stations.
                  <br />
                  From Rishikesh, you can hire a taxi or take a bus to
                  Rudraprayag/Narkota.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">🚌 By Road:</h3>
                <p className="text-gray-700">
                  Excellent road connectivity from Delhi (370 km) via
                  Meerut–Haridwar–Rishikesh–Devprayag–Srinagar.
                  <br />
                  Buses to Rudraprayag are available from ISBT Kashmiri Gate,
                  Delhi, and other Uttarakhand cities.
                  <br />
                  Taxis and shared vehicles are available from Rishikesh,
                  Haridwar, Dehradun, Srinagar, and beyond.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="shadow-md">
            <CardContent className="pt-6 h-full">
              <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center h-full w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1702.7380136428335!2d78.93092549077694!3d30.257979148865914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3909b7ef1c0aa69f%3A0x94b35599cfe216b2!2sVedic%20Alaknanda%20Seva%20Sadan!5e0!3m2!1sen!2sin!4v1747835192254!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hotel Vedic Alaknanda Map"
                  className="rounded-md"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Contact;
