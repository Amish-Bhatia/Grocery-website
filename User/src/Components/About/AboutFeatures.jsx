import { Leaf, Headphones, ThumbsUp, ShieldCheck, Truck, CheckCircle } from "lucide-react";

export default function AboutFeatures() {
  const features = [
    { icon: Leaf, title: "100% Organic food", desc: "100% healthy & fresh food." },
    { icon: Headphones, title: "Great Support 24/7", desc: "Instant access to Contact." },
    { icon: ThumbsUp, title: "Customer Feedback", desc: "Our happy customer reviews." },
    { icon: ShieldCheck, title: "100% Secure Payment", desc: "We ensure your money is safe." },
    { icon: Truck, title: "Free Shipping", desc: "Free shipping with minimum order." },
    { icon: CheckCircle, title: "100% Organic Food", desc: "100% healthy & fresh food." },
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#F9F9F9] border-y border-gray-100">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-md border border-gray-200 h-[400px] sm:h-[480px] bg-[#EAF0E7] relative">
            <img
              src="/about-img-2-combined.png"
              alt="Organic Harvest"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "/about-img-2.png"; }}
            />
          </div>

          <div className="lg:col-span-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-snug mb-4">
              100% Trusted Organic Food Store
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-8">
              Pellentesque a porta metus, eu dapibus lorem. Cras non ante sed nisi imperdiet eleifend eu et ipsum. Integer eget efficitur odio, ac imperdiet ipsum. Proin efficitur velit sed ligula pellentesque placerat.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center shrink-0 border border-emerald-100">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 mb-1">{feat.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
