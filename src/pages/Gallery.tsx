import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "@/components/HeroSection";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import images from slideshow
import hotelImage from "../assets/hotel.webp";
import diningImage from "../assets/dining.webp";
import viewImage from "../assets/view.webp";
import roomImage from "../assets/room.webp";
import dining2 from "../assets/dining2.webp";
import customerDining from "../assets/CustomerDining.webp";
import hotel2 from "../assets/hotel2.webp";
import reception from "../assets/reception.webp";

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
  {
    id: 5,
    src: dining2,
    title: "Dining Area",
    description: "Elegant dining space with mountain views",
    category: "dining",
  },
  {
    id: 6,
    src: customerDining,
    title: "Customer Dining",
    description: "Customer dining experience",
    category: "dining",
  },
  {
    id: 7,
    src: hotel2,
    title: "Hotel Exterior",
    description: "Beautiful exterior view of Hotel Vedic Alaknanda",
    category: "hotel",
  },
  {
    id: 8,
    src: reception,
    title: "Reception",
    description: "Reception area of Hotel Vedic Alaknanda",
    category: "hotel",
  },
];

const categoryOptions = [
  { value: "all", label: "All Photos", count: galleryImages.length },
  {
    value: "hotel",
    label: "Hotel",
    count: galleryImages.filter((img) => img.category === "hotel").length,
  },
  {
    value: "rooms",
    label: "Rooms",
    count: galleryImages.filter((img) => img.category === "rooms").length,
  },
  {
    value: "dining",
    label: "Dining",
    count: galleryImages.filter((img) => img.category === "dining").length,
  },
  {
    value: "views",
    label: "Views",
    count: galleryImages.filter((img) => img.category === "views").length,
  },
];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredImages =
    selectedCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  const selectedOption = categoryOptions.find(
    (option) => option.value === selectedCategory
  );

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <HeroSection
        title="Our Photo Gallery"
        description="Discover the elegance and tranquility that awaits you"
      />

      {/* Video Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Experience Our Hotel
            </h2>
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
              <iframe
                src="https://www.youtube.com/embed/HxqucXjyz0o"
                title="Hotel Vedic Alaknanda Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="flex-1 px-4 md:px-6 lg:px-8 py-8 md:py-10 max-w-7xl mx-auto w-full">
        {/* Category Selector */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-hotel-dark">
              Browse by Category
            </h2>
            <div className="w-full sm:w-64">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span>{selectedOption?.label}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {selectedOption?.count}
                      </Badge>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{option.label}</span>
                        <Badge variant="secondary" className="ml-2">
                          {option.count}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Image Grid */}
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
                      <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="font-semibold text-sm md:text-base mb-1 line-clamp-1">
                          {image.title}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-200 line-clamp-2">
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
                    <div className="p-4 md:p-6">
                      <h3 className="text-xl md:text-2xl font-bold mb-2">
                        {image.title}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base">
                        {image.description}
                      </p>
                      <Badge variant="outline" className="mt-3 capitalize">
                        {image.category}
                      </Badge>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No images found in this category.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
};

export default Gallery;
