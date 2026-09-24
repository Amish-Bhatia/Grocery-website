import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, ChevronDown, User as UserIcon } from "lucide-react";

export default function TopBar({ user, isLoggedIn, logout }) {
  const [language, setLanguage] = useState("Eng");
  const [currency, setCurrency] = useState("USD");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCurrOpen, setIsCurrOpen] = useState(false);

  const langRef = useRef(null);
  const currRef = useRef(null);

  const languages = [
    { code: "Eng", label: "English" },
    { code: "Hin", label: "Hindi" },
    { code: "Fra", label: "Français" },
    { code: "Ger", label: "Deutsch" },
  ];

  const currencies = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
    { code: "INR", symbol: "₹" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) setIsLangOpen(false);
      if (currRef.current && !currRef.current.contains(event.target)) setIsCurrOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-white border-b border-gray-200 text-xs text-gray-500">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[42px] gap-4 max-sm:justify-end">
          <div className="hidden sm:flex items-center gap-1.5 text-gray-500 text-xs truncate">
            <MapPin size={15} className="text-gray-400 shrink-0" />
            <span className="truncate">Store Location: Lincoln- 344, Illinois, Chicago, USA</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <div className="relative inline-flex items-center" ref={langRef}>
              <button
                type="button"
                className="inline-flex items-center gap-1 bg-transparent text-xs text-gray-500 hover:text-gray-900 cursor-pointer py-1 transition-colors"
                onClick={() => { setIsLangOpen(!isLangOpen); setIsCurrOpen(false); }}
              >
                <span>{language}</span>
                <ChevronDown size={12} />
              </button>
              {isLangOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg min-w-[110px] z-50 py-1">
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      className={`block w-full px-3.5 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                        language === item.code ? "bg-gray-50 text-[#00B207] font-medium" : "text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => { setLanguage(item.code); setIsLangOpen(false); }}
                    >
                      {item.code} ({item.label})
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative inline-flex items-center" ref={currRef}>
              <button
                type="button"
                className="inline-flex items-center gap-1 bg-transparent text-xs text-gray-500 hover:text-gray-900 cursor-pointer py-1 transition-colors"
                onClick={() => { setIsCurrOpen(!isCurrOpen); setIsLangOpen(false); }}
              >
                <span>{currency}</span>
                <ChevronDown size={12} />
              </button>
              {isCurrOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg min-w-[110px] z-50 py-1">
                  {currencies.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      className={`block w-full px-3.5 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                        currency === item.code ? "bg-gray-50 text-[#00B207] font-medium" : "text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => { setCurrency(item.code); setIsCurrOpen(false); }}
                    >
                      {item.code} ({item.symbol})
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-gray-300 select-none font-light">|</span>

            {isLoggedIn ? (
              <div className="flex items-center gap-2.5">
                <Link to="/account/dashboard" className="flex items-center gap-1 text-[#1A1A1A] hover:text-[#00B207] font-medium text-xs transition-colors">
                  <UserIcon size={13} className="text-[#00B207]" />
                  {user?.name || "Account"}
                </Link>
                <button type="button" onClick={logout} className="text-xs text-gray-500 hover:text-rose-600 transition-colors cursor-pointer bg-transparent border-0 p-0">
                  (Logout)
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-xs text-gray-600 hover:text-[#00B207] font-medium transition-colors">Sign In</Link>
                <span className="text-gray-300 select-none">/</span>
                <Link to="/signup" className="text-xs text-[#00B207] hover:underline font-semibold transition-colors">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
