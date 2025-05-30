import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Badrinath from "../assets/badrinath-temple-bnr-removebg-preview.png";

const localAttractions = [
  {
    name: "Dhari Devi Temple",
    description:
      "Perched on the banks of the Alaknanda River, this revered temple is dedicated to Goddess Kali and is considered the guardian deity of Uttarakhand. The spiritual atmosphere and scenic location make it a must-visit.",
    image: "https://t.eucdn.in/tourism/lg/dhari-devi-temple-895254.webp",
    distance: "10 km",
  },
  {
    name: "Rudraprayag Sangam",
    description:
      "A sacred confluence of the Alaknanda and Mandakini rivers, this tranquil spot is significant in Hindu mythology and offers a peaceful retreat for visitors and pilgrims.",
    image:
      "https://uttarakhandtourism.gov.in/assets/media/UTDB_media_1736493899Sangam.jpg",
    distance: "7 km",
  },
  {
    name: "Kartik Swami Temple",
    description:
      "Dedicated to Lord Kartikeya, this hilltop temple is accessible via a scenic trek. It offers breathtaking panoramic views of the Himalayas, making it a favorite among trekkers and pilgrims alike.",
    image:
      "https://uttarakhandtourism.gov.in/assets/media/UTDB_media_1736320040Photography-Kartik.jpeg",
    distance: "40 km",
  },
  {
    name: "Kedarnath",
    description:
      "Located at 3,583 meters and accessible via a scenic 16 km trek from Gaurikund, Kedarnath is one of the 12 Jyotirlingas of Lord Shiva. Surrounded by majestic snow-covered peaks, it is a deeply revered spiritual destination.",
    image:
      "https://badrinath-kedarnath.gov.in/css_js_2024/img/kedarnath-4k.jpg",
    distance: "85 km (plus 16 km trek from Gaurikund)",
  },
  {
    name: "Badrinath",
    description:
      "One of the most sacred Char Dham pilgrimage sites, Badrinath is dedicated to Lord Vishnu and set amidst the Nar and Narayan mountain ranges. It combines spiritual significance with natural grandeur.",
    image: Badrinath,
    distance: "140 km",
  },

  {
    name: "Koteshwar Mahadev Temple",
    description:
      "Located in a cave by the Alaknanda River, this temple dedicated to Lord Shiva is believed to be where he meditated before going to Kedarnath. It's a serene and spiritually rich destination.",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Koteshwar1.jpg",
    distance: "11 km",
  },
  {
    name: "Trijuginarayan Temple",
    description:
      "An ancient temple dedicated to Lord Vishnu, Trijuginarayan is believed to be the site where Lord Shiva and Goddess Parvati were married, with Lord Vishnu acting as a witness. The eternal flame in front of the temple is said to have been burning since their divine union.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Triyuginarayan_Temple.jpg/1200px-Triyuginarayan_Temple.jpg",
    distance: "60 km",
  },
  {
    name: "Augustmuni",
    description:
      "Named after Sage Agastya, this small town is known for the Agasteshwar Mahadev Temple on the banks of the Mandakini River. It's a cultural and spiritual hub with an annual fair in April.",
    image: "",
    distance: "25 km",
  },
  {
    name: "Deoria Tal",
    description:
      "A serene, high-altitude lake known for its mirror-like reflections of the Chaukhamba peaks. Popular for trekking, camping, and photography, it's a peaceful escape into nature.",
    image: "https://t.eucdn.in/tourism/lg/deoriyatal-1155775.webp",
    distance: "49 km",
  },
  {
    name: "Chopta",
    description:
      "Often called the 'Mini Switzerland of Uttarakhand', Chopta is a picturesque hill station surrounded by evergreen forests and meadows. It's also the starting point for treks to Tungnath and Chandrashila.",
    image:
      "https://uttarakhandtourism.gov.in/assets/media/UTDB_media_logo1745916342a5160ff72b8591a242f1fe76dc5fe7f3.jpg",
    distance: "55 km",
  },
  {
    name: "Tungnath Temple",
    description:
      "The highest Shiva temple in the world, situated at an altitude of 3,680 meters. A 3 km trek from Chopta leads to this ancient temple, offering divine blessings and awe-inspiring views.",
    image: "https://t.eucdn.in/tourism/lg/tungnath-5173043.webp",
    distance: "60 km",
  },
  {
    name: "Kalimath Temple",
    description:
      "A sacred Shakti Peetha, Kalimath Temple is dedicated to Goddess Kali and uniquely features no idol—only a symbolic silver plate. The temple is revered for its powerful spiritual energy.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/1/11/Kalimathmaa.jpg",
    distance: "49 km",
  },
  {
    name: "Ukhimath",
    description:
      "Home to the winter seat of the Kedarnath and Madhyamaheshwar deities, Ukhimath is dotted with ancient temples and offers a peaceful atmosphere amidst the hills.",
    image: "",
    distance: "41 km",
  },
  {
    name: "Khirsu",
    description:
      "A hidden gem in the Garhwal Himalayas, Khirsu is a peaceful hill station known for its scenic apple orchards and unobstructed views of over 300 snow-capped peaks. Ideal for nature lovers and solitude seekers.",
    image:
      "https://uttarakhandtourism.gov.in/assets/media/UTDB_media_logo1746513945Khirsu-snow.jpg",
    distance: "80 km",
  },
  {
    name: "Ali Bedni Bugyal",
    description:
      "These twin alpine meadows are part of one of the most beautiful treks in Uttarakhand. Known for their vast green pastures, wildflowers, and panoramic Himalayan views, they are perfect for trekkers and campers.",
    image: "https://t.eucdn.in/tourism/lg/roopkund-8152361.webp",
    distance: "125 km (starting point: Lohajung)",
  },
  {
    name: "Roopkund",
    description:
      "Famous for the mysterious skeletal remains at the lake bed, Roopkund is a high-altitude glacial lake surrounded by mountains and myth. The trek to Roopkund is challenging but immensely rewarding for adventure lovers.",
    image:
      "https://ichef.bbci.co.uk/news/1536/cpsprodpb/DE2D/production/_117077865_atish_waghwase_1.jpg.webp",
    distance: "130 km (starting point: Lohajung)",
  },
  {
    name: "Valley of Flowers",
    description:
      "A UNESCO World Heritage Site, the Valley of Flowers is a vibrant alpine meadow adorned with a stunning variety of endemic flora. Surrounded by snow-capped peaks, it's a paradise for trekkers, botanists, and nature lovers.",
    image:
      "https://uttarakhandtourism.gov.in/assets/media/UTDB_media_1736759310Nanda_Devi_National_Park.jpg",
    distance: "130 km",
  },
  {
    name: "Kashi Vishwanath Temple, Guptkashi",
    description:
      "Located in the spiritual town of Guptkashi, this ancient temple is dedicated to Lord Shiva and mirrors the famous Kashi Vishwanath of Varanasi. It holds great significance for pilgrims en route to Kedarnath.",
    image:
      "https://uttarakhandguide.com/wp-content/uploads/2023/04/Vishwanath.jpg",
    distance: "50 km",
  },
  {
    name: "Gwaldam",
    description:
      "A peaceful hill town perched at the junction of the Garhwal and Kumaon regions, Gwaldam is known for its apple orchards, serene landscapes, and panoramic views of the Himalayan peaks.",
    image:
      "https://uttarakhandtourism.gov.in/assets/media/UTDB_media_1736246207Village-Tourism.jpg",
    distance: "100 km",
  },
  {
    name: "Chidang Khalsa Village",
    description:
      "A quaint Himalayan village near Tharali Block, Chidang Khalsa offers an authentic glimpse into Garhwali rural life. Surrounded by lush green hills and terraced fields, it's an ideal stop for peaceful walks, cultural exploration, and nature photography.",
    image: "https://myroots.euttaranchal.com/photos/41736-1656084559-99749.jpg",
    distance: "7 km",
  },
];

const ImageWithFallback = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  if (!src || error) {
    return (
      <div
        ref={imgRef}
        className={`${className} bg-gray-200 flex items-center justify-center`}
      >
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  return (
    <div ref={imgRef} className={className}>
      {isVisible ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover rounded-lg"
          loading="lazy"
          onError={() => setError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
      )}
    </div>
  );
};

const AttractionCard = React.memo(
  ({ attraction }: { attraction: (typeof localAttractions)[0] }) => (
    <div className="bg-white shadow-md p-4 rounded-xl flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <h3 className="text-xl font-semibold">{attraction.name}</h3>
        <p className="text-gray-600 mt-2">{attraction.description}</p>
        <p className="mt-2 text-sm text-gray-700">
          <strong>Distance:</strong> {attraction.distance}
        </p>
      </div>

      {attraction.image && (
        <div className="md:w-64 w-full">
          <ImageWithFallback
            src={attraction.image}
            alt={attraction.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  )
);

AttractionCard.displayName = "AttractionCard";

const Explore = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="relative h-64 bg-gradient-to-r from-hotel-dark to-hotel-gold flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Local Attractions
          </h1>
          <p className="text-lg md:text-xl">
            Explore the vibrant local culture, historic sites and temples, and
            natural wonders surrounding our hotel.
          </p>
        </div>
      </section>
      <div className="container mx-auto px-4 ">
        <section className="mt-10">
          <div className="flex flex-col gap-6">
            {localAttractions.map((attraction, index) => (
              <AttractionCard key={index} attraction={attraction} />
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Explore;
