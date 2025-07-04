import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroSection from "../components/HeroSection";

const Dining = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <HeroSection
        title="Culinary Delights"
        description="Savor authentic flavors in a serene mountain setting"
      />

      <div className="flex-1 bg-gray-50 py-8 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Card className="h-full">
            <CardContent className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                Pure Vegetarian Restaurant
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Enjoy a soulful dining experience at our pure vegetarian
                restaurant, serving a curated menu of Indian and international
                cuisine. All dishes are prepared using fresh, locally sourced
                ingredients in a serene, family-friendly setting.
              </p>
            </CardContent>
          </Card>
          <Card className="h-full">
            <CardContent className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                Local Specialties
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Savor the true taste of Uttarakhand with traditional Kumaoni &
                Garhwali dishes, crafted by local chefs using age-old recipes
                and fresh mountain produce. A must-try for those seeking
                authentic vegetarian flavors of the region.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dining;
