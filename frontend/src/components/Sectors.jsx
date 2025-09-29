import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Manufacturing from "../assets/sectors/Manufacturing.jpg";
import Education from "../assets/sectors/Education.jpg";
import Mining from "../assets/sectors/Mining.jpg";
import Oil from "../assets/sectors/oil.jpg";
import IT from "../assets/sectors/IT.jpg";
import Healthcare from "../assets/sectors/healthcare.jpg";
import Agriculture from "../assets/sectors/agriculture.jpg";
import Finance from "../assets/sectors/finance.jpg";
import Tourism from "../assets/sectors/tourism.jpg";
import Logistics from "../assets/sectors/logistics.jpg";

const sectors = [
  {
    title: "Manufacturing & Industrial",
    image: Manufacturing,
    description: "Drive innovation in production, supply chain, and industrial technology.",
  },
  {
    title: "Media, Entertainment & Education",
    image: Education,
    description: "Shape the future of content, learning, and digital media experiences.",
  },
  {
    title: "Metals & Mining",
    image: Mining,
    description: "Explore opportunities in resource extraction and sustainable material processing.",
  },
  {
    title: "Oil, Gas & Energy",
    image: Oil,
    description: "Contribute to the energy sector, from traditional sources to renewable technologies.",
  },
  {
    title: "Information Technology & Software",
    image: IT,
    description: "Build the next generation of software, AI, and cloud computing solutions.",
  },
  {
    title: "Healthcare & Pharmaceuticals",
    image: Healthcare,
    description: "Innovate in medical research, patient care, and pharmaceutical development.",
  },
  {
    title: "Agriculture & Food Processing",
    image: Agriculture,
    description: "Enhance food production and sustainability through modern agricultural practices.",
  },
  {
    title: "Banking, Finance & Insurance",
    image: Finance,
    description: "Engage with the world of finance, investment strategies, and risk management.",
  },
  {
    title: "Tourism & Hospitality",
    image: Tourism,
    description: "Create memorable experiences in travel, hotel management, and event planning.",
  },
  {
    title: "Transport & Logistics",
    image: Logistics,
    description: "Optimize the movement of goods and people through smart logistics solutions.",
  },
];

function Sectors() {
  return (
    <section className="py-20 bg-orange-50">
      <div className="container mx-auto text-center px-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Explore Diverse Opportunities
        </h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
          Gain hands-on experience in a wide range of thriving sectors across India.
        </p>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          speed={800}
        >
          {sectors.map((sector, index) => (
            <SwiperSlide key={index}>
              <div className="relative rounded-xl overflow-hidden shadow-lg group transform hover:-translate-y-2 transition-transform duration-300">
                <img
                  src={sector.image}
                  alt={sector.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-orange-600 bg-opacity-80 flex flex-col items-center justify-center p-4 text-center text-white
                            translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100
                            transition-all duration-500 ease-in-out">
                  <h3 className="text-xl font-bold mb-2">{sector.title}</h3>
                  <p className="text-sm font-light">{sector.description}</p>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 group-hover:opacity-0">
                    <h3 className="text-lg font-semibold text-white">{sector.title}</h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-12">
          <button className="bg-orange-600 text-white text-lg px-8 py-3 rounded-full shadow-lg hover:bg-orange-700 transform hover:scale-105 transition-all duration-300">
            View All Sectors
          </button>
        </div>
      </div>
    </section>
  );
}

export default Sectors;