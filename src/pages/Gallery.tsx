import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContentSection from "../components/ContentSection";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Import images from slideshow
import hotelImage from "../assets/hotel.webp";
import diningImage from "../assets/dining.webp";
import viewImage from "../assets/view.webp";
import roomImage from "../assets/room.webp";

interface GalleryImage {
  id: number;
  src: string;
  title: string;
  description: string;
  category: "hotel" | "rooms" | "dining" | "views";
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: hotelImage,
    title: "Hotel Exterior",
    description: "Beautiful exterior view of Hotel Vedic Alaknanda",
    category: "hotel",
  },
  {
    id: 2,
    src: diningImage,
    title: "Dining Area",
    description: "Elegant dining space with mountain views",
    category: "dining",
  },
  {
    id: 3,
    src: viewImage,
    title: "Panoramic Views",
    description: "Breathtaking mountain and valley views from the hotel",
    category: "views",
  },
  {
    id: 4,
    src: roomImage,
    title: "Comfortable Rooms",
    description: "Luxurious and comfortable guest accommodations",
    category: "rooms",
  },
];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const filteredImages =
    selectedCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  const getCategoryCount = (category: string) => {
    if (category === "all") return galleryImages.length;
    return galleryImages.filter((img) => img.category === category).length;
  };

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-hotel-dark to-hotel-gold flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Gallery</h1>
          <p className="text-lg md:text-xl">
            Explore the beauty of Hotel Vedic Alaknanda
          </p>
        </div>
      </section>

      <ContentSection
        id="gallery-content"
        title="Our Photo Gallery"
        subtitle="Discover the elegance and tranquility that awaits you"
        className="bg-gray-50"
      >
        <div className="max-w-6xl mx-auto">
          {/* Category Tabs */}
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="mb-8"
          >
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="all" className="flex items-center gap-2">
                All
                <Badge variant="secondary" className="ml-1">
                  {getCategoryCount("all")}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="hotel" className="flex items-center gap-2">
                Hotel
                <Badge variant="secondary" className="ml-1">
                  {getCategoryCount("hotel")}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="rooms" className="flex items-center gap-2">
                Rooms
                <Badge variant="secondary" className="ml-1">
                  {getCategoryCount("rooms")}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="dining" className="flex items-center gap-2">
                Dining
                <Badge variant="secondary" className="ml-1">
                  {getCategoryCount("dining")}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="views" className="flex items-center gap-2">
                Views
                <Badge variant="secondary" className="ml-1">
                  {getCategoryCount("views")}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCategory}>
              {/* Image Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredImages.map((image) => (
                  <Dialog key={image.id}>
                    <DialogTrigger asChild>
                      <Card className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={image.src}
                            alt={image.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h3 className="font-semibold text-lg mb-1">
                              {image.title}
                            </h3>
                            <p className="text-sm text-gray-200">
                              {image.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                      <div className="relative">
                        <img
                          src={image.src}
                          alt={image.title}
                          className="w-full h-auto max-h-[80vh] object-contain"
                        />
                        <div className="p-6">
                          <h3 className="text-2xl font-bold mb-2">
                            {image.title}
                          </h3>
                          <p className="text-gray-600">{image.description}</p>
                          <Badge variant="outline" className="mt-3 capitalize">
                            {image.category}
                          </Badge>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No images found in this category.
              </p>
            </div>
          )}
        </div>
      </ContentSection>

      <Footer />
    </main>
  );
};

export default Gallery;
