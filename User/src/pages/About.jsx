import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Leaf,
  Headphones,
  ThumbsUp,
  ShieldCheck,
  Truck,
  CheckCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
} from "lucide-react";
import PageBanner from "../Components/PageBanner";
import Newsletter from "../Components/Newsletter";
import apimethods from "../services/api";

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
        // fallback
        setTestimonials([
          {
            _id: "t1",
            name: "Robert Fox",
            role: "Customer",
            feedback:
              "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit volutpat.",
            rating: 5,
            image: "/Robert.png",
          },
          {
            _id: "t2",
            name: "Dianne Russell",
            role: "Customer",
            feedback:
              "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit volutpat.",
            rating: 5,
            image: "/Dennie.png",
          },
          {
            _id: "t3",
            name: "Eleanor Pena",
            role: "Customer",
            feedback:
              "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit volutpat.",
            rating: 5,
            image: "/eleanor.png",
          },
        ]);
      });
  }, []);

  const teamMembers = [
    {
      name: "Jenny Wilson",
      role: "CEO & Founder",
      image: "/our-awesome-team-img-1.png",
    },
    {
      name: "Jane Cooper",
      role: "Worker",
      image: "/our-awesome-team-img-2.png",
    },
    {
      name: "Cody Fisher",
      role: "Security Guard",
      image: "/our-awesome-team-img-3.png",
    },
    {
      name: "Robert Fox",
      role: "Senior Farmer Manager",
      image: "/our-awesome-team-img-4.png",
    },
  ];

  return (
    <div className="w-full bg-white font-sans min-h-screen">
      {/* Top Banner with Breadcrumb & Universal Back Button */}
      <PageBanner breadcrumbs={[{ label: "About" }]} />

      {/* ============================================================
          SECTION 1: 100% Trusted Organic Food Store (Screenshot 5)
          ============================================================ */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                100% Trusted Organic Food Store
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                Morbi porttitor ligula id varius sagittis. Proin dui sodales cursus bibendum. Vivamus convallis elit in ante dictum, vitae tincidunt velit imperdiet. Sed et consectetur magna, vitae tincidunt neque.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Nunc hendrerit sollicitudin metus, et imperdiet magna convallis nec. Ut accumsan ante at justo egestas commodo. Phasellus vel nisi non turpis aliquet sollicitudin.
              </p>
            </div>

            {/* Right Photo: Farmer with tomatoes */}
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 h-[360px] sm:h-[420px] bg-gray-50">
              <img
                src="/about-img-1.png"
                alt="Elderly Organic Farmer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/banner.jpg";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: 100% Trusted Organic Food Store (6 Features)
          ============================================================ */}
      <section className="py-14 sm:py-20 bg-[#F9F9F9] border-y border-gray-100">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Image: Farmer in field with greens */}
            <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-md border border-gray-200 h-[400px] sm:h-[480px] bg-[#EAF0E7] relative">
              <img
                src="/about-img-2-combined.png"
                alt="Organic Harvest"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/about-img-2.png";
                }}
              />
            </div>

            {/* Right Content: Title + 6 Pillars */}
            <div className="lg:col-span-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-snug mb-4">
                100% Trusted Organic Food Store
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-8">
                Pellentesque a porta metus, eu dapibus lorem. Cras non ante sed nisi imperdiet eleifend eu et ipsum. Integer eget efficitur odio, ac imperdiet ipsum. Proin efficitur velit sed ligula pellentesque placerat.
              </p>

              {/* 6 Features (2x3 Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 1. 100% Organic Food */}
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center shrink-0 border border-emerald-100">
                    <Leaf size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1">
                      100% Organic food
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      100% healthy &amp; fresh food.
                    </p>
                  </div>
                </div>

                {/* 2. Great Support 24/7 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center shrink-0 border border-emerald-100">
                    <Headphones size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1">
                      Great Support 24/7
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Instant access to Contact.
                    </p>
                  </div>
                </div>

                {/* 3. Customer Feedback */}
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center shrink-0 border border-emerald-100">
                    <ThumbsUp size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1">
                      Customer Feedback
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Our happy customer reviews.
                    </p>
                  </div>
                </div>

                {/* 4. 100% Secure Payment */}
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center shrink-0 border border-emerald-100">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1">
                      100% Secure Payment
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      We ensure your money is safe.
                    </p>
                  </div>
                </div>

                {/* 5. Free Shipping */}
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center shrink-0 border border-emerald-100">
                    <Truck size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1">
                      Free Shipping
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Free shipping with minimum order.
                    </p>
                  </div>
                </div>

                {/* 6. 100% Organic Food (Repeat from Figma) */}
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center shrink-0 border border-emerald-100">
                    <CheckCircle size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1">
                      100% Organic Food
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      100% healthy &amp; fresh food.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: We Delivered, You Enjoy Your Order. (Screenshot 5)
          ============================================================ */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
                We Delivered, You Enjoy Your Order.
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>

              {/* Bullet checks */}
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

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-[#00B207] hover:bg-[#009606] text-white px-8 py-3.5 rounded-full font-semibold text-sm transition shadow-sm"
              >
                <span>Shop Now</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Right Photo: Delivery Courier */}
            <div className="flex justify-center">
              <div className="max-w-md rounded-2xl overflow-hidden">
                <img
                  src="/about-img-3.png"
                  alt="Delivery Courier"
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    e.target.src = "/topRight.png";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: Our Awesome Team (Screenshot 5)
          ============================================================ */}
      <section className="py-14 sm:py-20 bg-[#F9F9F9] border-t border-gray-100">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Our Awesome Team
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Pellentesque vulputate metus eu magna mollis, nec dictum lectus volutpat. Quisque sit amet arcu pretium tellus.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xs hover:shadow-md transition-shadow group"
              >
                <div className="h-72 w-full overflow-hidden bg-gray-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "/Robert.png";
                    }}
                  />
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-base text-gray-900 mb-0.5">
                    {member.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: Client Testimonials (Screenshot 5)
          ============================================================ */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Client Testimonials
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center transition"
                aria-label="Previous testimonials"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-[#00B207] text-white hover:bg-[#009606] flex items-center justify-center transition shadow-xs"
                aria-label="Next testimonials"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((item) => (
              <div
                key={item._id || item.name}
                className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <Quote size={28} className="text-[#00B207] mb-4 opacity-70" />
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                    {item.feedback}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || "/Robert.png"}
                      alt={item.name}
                      className="w-11 h-11 rounded-full object-cover border border-gray-100"
                      onError={(e) => {
                        e.target.src = "/Robert.png";
                      }}
                    />
                    <div>
                      <h5 className="font-bold text-sm text-gray-900">
                        {item.name}
                      </h5>
                      <span className="text-xs text-gray-400 font-normal">
                        {item.role || "Customer"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center text-[#FF8A00]">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 6: Partner Brands Strip (Screenshot 5)
          ============================================================ */}
      <div className="border-t border-gray-100 bg-white py-6 sm:py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <img
            src="/above follow us on insta.png"
            alt="Partner Brands"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* ============================================================
          SECTION 7: Pre-Footer Newsletter
          ============================================================ */}
      <Newsletter />
    </div>
  );
}
