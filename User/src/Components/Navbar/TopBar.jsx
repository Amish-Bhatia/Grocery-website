
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, ChevronDown, User as UserIcon } from "lucide-react";

export default function TopBar({ user, isLoggedIn, logout }) {
  const [language, setLanguage] = useState("Eng");
  const [currency, setCurrency] = useState("INR");

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCurrOpen, setIsCurrOpen] = useState(false);

  const langRef = useRef(null);
  const currRef = useRef(null);

  const languages = [
    { code: "Eng", label: "English" },
    // { code: "Hin", label: "Hindi" },
    // { code: "Fra", label: "Français" },
    // { code: "Ger", label: "Deutsch" },
  ];

  const currencies = [
    // { code: "USD", symbol: "$" },
    // { code: "EUR", symbol: "€" },
    // { code: "GBP", symbol: "£" },
    { code: "INR", symbol: "₹" },
  ];

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const [storeLocation, setStoreLocation] = useState(
    "Detecting location..."
  );

  const [locationError, setLocationError] = useState(null);

  // Get user's latitude and longitude
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLocation({
          latitude,
          longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationError(error.message);
        setStoreLocation("Location unavailable");
      }
    );
  }, []);

  // Reverse geocode latitude/longitude
  useEffect(() => {
    if (
      location.latitude === null ||
      location.longitude === null
    ) {
      return;
    }

    const getLocation = async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`;

        const result = await fetch(url);

        if (!result.ok) {
          throw new Error("Failed to fetch location");
        }

        const data = await result.json();

        console.log("Nominatim response:", data);

        const address = data.address;

        const city =
          address?.city ||
          address?.town ||
          address?.village ||
          address?.municipality ||
          "";

        const state = address?.state || "";
        const country = address?.country || "";

        const formattedLocation = [
          city,
          state,
          country,
        ]
          .filter(Boolean)
          .join(", ");

        setStoreLocation(
          formattedLocation || data.display_name || "Location unavailable"
        );
      } catch (error) {
        console.error("Reverse geocoding error:", error);
        setStoreLocation("Location unavailable");
      }
    };

    getLocation();
  }, [location]);

  // Close language/currency dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        langRef.current &&
        !langRef.current.contains(event.target)
      ) {
        setIsLangOpen(false);
      }

      if (
        currRef.current &&
        !currRef.current.contains(event.target)
      ) {
        setIsCurrOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div className="w-full bg-white border-b border-gray-200 text-xs text-gray-500">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[42px] gap-4 max-sm:justify-end">

          {/* Location */}
          <div className="hidden sm:flex items-center gap-1.5 text-gray-500 text-xs truncate">
            <MapPin
              size={15}
              className="text-gray-400 shrink-0"
            />

            <span className="truncate">
              Store Location: {storeLocation}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 shrink-0">

            {/* Language */}
            <div
              className="relative inline-flex items-center"
              ref={langRef}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1 bg-transparent text-xs text-gray-500 hover:text-gray-900 cursor-pointer py-1 transition-colors"
                onClick={() => {
                  setIsLangOpen(!isLangOpen);
                  setIsCurrOpen(false);
                }}
              >
                <span>{language}</span>
                <ChevronDown size={12} />
              </button>

              {isLangOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg min-w-[110px] z-50 py-1">
                  {languages.map((item) => (
                    <button key={item.code} type="button" className={`block w-full px-3.5 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                        language === item.code
                          ? "bg-gray-50 text-[#00B207] font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setLanguage(item.code);
                        setIsLangOpen(false);
                      }}
                    >
                      {item.code} ({item.label})
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div
              className="relative inline-flex items-center"
              ref={currRef}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1 bg-transparent text-xs text-gray-500 hover:text-gray-900 cursor-pointer py-1 transition-colors"
                onClick={() => {
                  setIsCurrOpen(!isCurrOpen);
                  setIsLangOpen(false);
                }}
              >
                <span>{currency}</span>
                <ChevronDown size={12} />
              </button>123
              
              {isCurrOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg min-w-[110px] z-50 py-1">
                  {currencies.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      className={`block w-full px-3.5 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                        currency === item.code
                          ? "bg-gray-50 text-[#00B207] font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setCurrency(item.code);
                        setIsCurrOpen(false);
                      }}
                    >
                      {item.code} ({item.symbol})
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-gray-300 select-none font-light">
              |
            </span>

            {/* Account */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/account/dashboard"
                  className="flex items-center gap-1 text-[#1A1A1A] hover:text-[#00B207] font-medium text-xs transition-colors"
                >
                  <UserIcon
                    size={13}
                    className="text-[#00B207]"
                  />
                  {user?.name || "Account"}
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="text-xs text-gray-500 hover:text-rose-600 transition-colors cursor-pointer bg-transparent border-0 p-0"
                >
                  (Logout)
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs text-gray-600 hover:text-[#00B207] font-medium transition-colors"
                >
                  Sign In
                </Link>

                <span className="text-gray-300 select-none">
                  /
                </span>

                <Link
                  to="/signup"
                  className="text-xs text-[#00B207] hover:underline font-semibold transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}