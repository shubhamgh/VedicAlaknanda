
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ContentSection from "@/components/ContentSection";

const Dining = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-hotel-dark to-hotel-gold flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Dining Experience</h1>
          <p className="text-lg md:text-xl">Savor authentic flavors in a serene mountain setting</p>
        </div>
      </section>

      <ContentSection
        id="dining-content"
        title="Culinary Delights"
        subtitle="Experience fine dining with breathtaking mountain views"
        className="bg-gray-50"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Restaurant</h2>
              <p className="text-gray-600">
                Experience fine dining at its best with our world-class
                restaurant offering a diverse menu of international and local
                cuisine prepared with fresh, locally sourced ingredients.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Local Specialties</h2>
              <p className="text-gray-600">
                Discover the authentic flavors of Uttarakhand with our selection
                of traditional dishes prepared by expert local chefs using
                time-honored recipes and fresh mountain ingredients.
              </p>
            </CardContent>
          </Card>
        </div>
      </ContentSection>
      
      <Footer />
    </div>
  );
};

export default Dining;
