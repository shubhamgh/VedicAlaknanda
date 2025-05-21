
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Map, Phone, Mail, Clock, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // In a real application, you would send this data to your backend
    // For now, we'll just simulate a successful submission
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "Thank you for your message. We'll get back to you soon!",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <Card className="h-full shadow-md">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-6">Reach Us</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <Map className="h-5 w-5 mr-3 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Address</h3>
                        <p className="text-gray-600 mt-1">
                          Vedic Alaknanda Retreat<br />
                          Narkota, near Rudraprayag<br />
                          Uttarakhand, India
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 mr-3 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Phone</h3>
                        <p className="text-gray-600 mt-1">
                          <a href="tel:+919815812309" className="hover:text-blue-600 transition-colors">
                            +91 98158 12309
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 mr-3 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-gray-600 mt-1">
                          <a href="mailto:info@vedicalaknandaretreats.com" className="hover:text-blue-600 transition-colors">
                            info@vedicalaknandaretreats.com
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 mr-3 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Hours</h3>
                        <p className="text-gray-600 mt-1">
                          Reception: 24/7<br />
                          Check-in: 12:00 PM<br />
                          Check-out: 11:00 AM
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="font-medium mb-2">Getting Here</h3>
                    <p className="text-gray-600">
                      We are located on the banks of the serene Alaknanda River, approximately 
                      15 km from Rudraprayag. The nearest major airport is Jolly Grant Airport 
                      in Dehradun (160 km). We can arrange transportation from Rudraprayag 
                      or Dehradun upon request.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Contact Form */}
            <div>
              <Card className="h-full shadow-md">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
                  
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Your Name
                      </label>
                      <Input 
                        id="name" 
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email Address
                      </label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-1">
                        Subject
                      </label>
                      <Input 
                        id="subject" 
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Enter subject" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">
                        Message
                      </label>
                      <Textarea 
                        id="message" 
                        value={formData.message}
                        onChange={handleChange}
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

          {/* Map */}
          <div className="mt-12">
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">Our Location</h2>
                <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3471.544149481884!2d79.31567591505821!3d30.286179981796657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39093e5f69e755a7%3A0x5106a6c2e5aadd31!2sRudraprayag%2C%20Uttarakhand%20246171!5e0!3m2!1sen!2sin!4v1653241303345!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Vedic Alaknanda Retreat Map"
                    className="rounded-md"
                  ></iframe>
                </div>
                <div className="mt-4 flex justify-center">
                  <Link to="/">
                    <Button variant="outline">Back to Home</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;
