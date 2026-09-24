import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import PageBanner from "../Components/PageBanner";
import Newsletter from "../Components/Newsletter";
import apimethods from "../services/api";
import AboutFeatures from "../Components/About/AboutFeatures";
import AboutTeam from "../Components/About/AboutTeam";
import AboutTestimonials from "../Components/About/AboutTestimonials";

export default function About() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    apimethods
      .getApi("/get-testimonials")
      .then((data) => {
        if (data?.testimonials && Array.isArray(data.testimonials)) {
          setTestimonials(data.testimonials);
        }
      })
      .catch(() => {
        setTestimonials([
          { _id: "t1", name: "Robert Fox", role: "Customer", feedback: "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus.", rating: 5, image: "/Robert.png" },
          { _id: "t2", name: "Dianne Russell", role: "Customer", feedback: "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus.", rating: 5, image: "/Dennie.png" },
          { _id: "t3", name: "Eleanor Pena", role: "Customer", feedback: "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus.", rating: 5, image: "/eleanor.png" },
        ]);
      });
  }, []);

  return (
    <div className="w-full bg-white font-sans min-h-screen">
      <PageBanner breadcrumbs={[{ label: "About" }]} />

      {/* Section 1: Intro */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                100% Trusted Organic Food Store
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                Morbi porttitor ligula id varius sagittis. Proin dui sodales cursus bibendum. Vivamus convallis elit in ante dictum, vitae tincidunt velit imperdiet. Sed et consectetur magna, vitae tincidunt neque.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Nunc hendrerit sollicitudin metus, et imperdiet magna convallis nec. Ut accumsan ante at justo egestas commodo.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 h-[360px] sm:h-[420px] bg-gray-50">
              <img src="/about-img-1.png" alt="Elderly Organic Farmer" className="w-full h-full object-cover" onError={(e) => { e.target.src = "/banner.jpg"; }} />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Features */}
      <AboutFeatures />

      {/* Section 3: Delivery Promo */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
                We Delivered, You Enjoy Your Order.
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-700">
                  <CheckCircle size={17} className="text-[#00B207] shrink-0" />
                  <span>Sed ut perspiciatis unde omnis iste natus</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-700">
                  <CheckCircle size={17} className="text-[#00B207] shrink-0" />
                  <span>Sit voluptatem accusantium doloremque laudantium</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-700">
                  <CheckCircle size={17} className="text-[#00B207] shrink-0" />
                  <span>Aenean consectetur ligula eget feugiat molestie</span>
                </div>
              </div>
              <Link to="/shop" className="inline-flex items-center gap-2 bg-[#00B207] hover:bg-[#009606] text-white px-8 py-3.5 rounded-full font-semibold text-sm transition shadow-sm">
                <span>Shop Now</span>
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="max-w-md rounded-2xl overflow-hidden">
                <img src="/about-img-3.png" alt="Delivery Courier" className="w-full h-auto object-contain" onError={(e) => { e.target.src = "/topRight.png"; }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Team */}
      <AboutTeam />

      {/* Section 5: Testimonials */}
      <AboutTestimonials testimonials={testimonials} />

      {/* Section 6: Brand Strip */}
      <div className="border-t border-gray-100 bg-white py-6 sm:py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <img src="/above follow us on insta.png" alt="Partner Brands" className="w-full h-auto object-contain" />
        </div>
      </div>

      <Newsletter />
    </div>
  );
}
