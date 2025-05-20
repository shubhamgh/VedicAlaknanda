import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Explore = () => {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Explore Our Area</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Local Attractions</CardTitle>
            <CardDescription>
              Discover the best sights and landmarks nearby
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Explore the vibrant local culture, historic sites, and natural
              wonders surrounding our hotel.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dining & Entertainment</CardTitle>
            <CardDescription>
              Experience local cuisine and nightlife
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Find the best restaurants, bars, and entertainment venues in the
              area.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activities</CardTitle>
            <CardDescription>
              Engage in exciting local activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              From outdoor adventures to cultural experiences, there's something
              for everyone.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Explore;
