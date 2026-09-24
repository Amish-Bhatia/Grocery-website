import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#808080] pt-14 pb-8 font-sans">
      <div className="w-full px-4 sm:px-6 lg:px-8">
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
        
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <img
                src="/footerLogo.png"
                alt="Ecobazar"
                className="h-8 sm:h-9 w-auto object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/Company Logo.png";
                }}
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5 max-w-sm">
              Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis dui, eget bibendum magna congue nec.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <a
                href="tel:2195550114"
                className="text-white border-b border-white hover:text-[#00B207] hover:border-[#00B207] pb-0.5 transition font-medium"
              >
                (219) 555-0114
              </a>
              <span className="text-gray-500">or</span>
              <a
                href="mailto:Proxy@gmail.com"
                className="text-white border-b border-white hover:text-[#00B207] hover:border-[#00B207] pb-0.5 transition font-medium"
              >
                Proxy@gmail.com
              </a>
            </div>
          </div>

          {/* Column 2: My Account */}
          <div>
            <h4 className="text-white text-base font-semibold mb-4 tracking-wide">
              My Account
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/account/dashboard" className="hover:text-white transition">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/account/order-history" className="hover:text-white transition">
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition">
                  Shoping Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Helps */}
          <div>
            <h4 className="text-white text-base font-semibold mb-4 tracking-wide">
              Helps
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-white transition">
                  Faqs
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  Terms &amp; Condition
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Proxy */}
          <div>
            <h4 className="text-white text-base font-semibold mb-4 tracking-wide">
              Proxy
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition">
                  Product
                </Link>
              </li>
              <li>
                <Link to="/account/order-history" className="hover:text-white transition">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Categories */}
          <div>
            <h4 className="text-white text-base font-semibold mb-4 tracking-wide">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/shop?category=Fresh%20Fruits" className="hover:text-white transition">
                  Fruit &amp; Vegetables
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Meat%20&%20Fish" className="hover:text-white transition">
                  Meat &amp; Fish
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Bread%20&%20Bakery" className="hover:text-white transition">
                  Bread &amp; Bakery
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Beauty%20&%20Health" className="hover:text-white transition">
                  Beauty &amp; Health
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#2C2C2C] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            Ecobazar eCommerce © 2021. All Rights Reserved
          </div>
          <div className="flex items-center">
            <img
              src="/paymentApps.png"
              alt="Payment Methods: Apple Pay, Visa, Discover, Mastercard, Secure Payment"
              className="h-11 sm:h-12 w-auto max-w-[320px] sm:max-w-[360px] object-contain transition-transform hover:scale-105"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
