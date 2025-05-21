
// Contact.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Map, Phone, Mail, Clock, Send } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        
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
                        <a href="tel:+919815812309" className="hover:text-blue-600">
                          +91 9815812309
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-3 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600 mt-1">
                        <a href="mailto:vedicalaknanda@gmail.com" className="hover:text-blue-600">
                          vedicalaknanda@gmail.com
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
            <Card className="h-full">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
                
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Your Name
                    </label>
                    <Input id="name" placeholder="Enter your name" />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">
                      Subject
                    </label>
                    <Input id="subject" placeholder="Enter subject" />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Message
                    </label>
                    <Textarea 
                      id="message" 
                      placeholder="Enter your message" 
                      rows={5}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" size="lg">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map */}
        <div className="mt-12">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Our Location</h2>
              <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Map will be integrated here</p>
              </div>
              <div className="mt-4 text-center">
                <Link to="/">
                  <Button variant="outline">Back to Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
