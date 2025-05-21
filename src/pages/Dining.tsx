import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const Dining = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-8">
          Dining Experience
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Restaurant</h2>
              <p className="text-gray-600">
                Experience fine dining at its best with our world-class
                restaurant offering a diverse menu of international and local
                cuisine.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dining;
