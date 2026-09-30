import React, { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Swal from "sweetalert2";
import PageBanner from "../Components/PageBanner";
import Newsletter from "../Components/Newsletter";

// Helper component to re-center the map dynamically
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 14);
    }
  }, [position, map]);
  return null;
}

// Custom Ecobazar Leaflet Pin Marker
const customIcon = L.divIcon({
  className: "custom-leaflet-marker",
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 48px; height: 48px;">
      <div style="position: absolute; width: 44px; height: 44px; background: rgba(0, 178, 7, 0.25); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: relative; width: 38px; height: 38px; background: #00B207; border: 3px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px rgba(0, 178, 7, 0.35);">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 42],
  popupAnchor: [0, -38],
});

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Coordinates for store location (e.g. San Jose, SD / central map view)
  const defaultPosition = [37.3382, -121.8863]; // San Jose coords
  const [position, setPosition] = useState(defaultPosition);
  const [isCurrentLocation, setIsCurrentLocation] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          setIsCurrentLocation(true);
        },
        (error) => {
          console.warn("Geolocation permission denied or unavailable", error.message);
        },
      {enableHighAccuracy:true, timeout: 10000}
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "success",
      title: "Message Sent!",
      text: "Thank you for reaching out. We will get back to you shortly!",
      confirmButtonColor: "#00B207",
    });
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="w-full bg-[#FFFFFF] font-sans">
      {/* Banner with Breadcrumb: Home > Contact */}
      <PageBanner breadcrumbs={[{ label: "Contact" }]} />

      {/* Main Content Section */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Info Card (4 Columns) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col divide-y divide-gray-100">
            
            {/* Address */}
            <div className="pb-7 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#EDF2EE] text-[#00B207] flex items-center justify-center mb-3">
                <MapPin size={24} strokeWidth={1.75} />
              </div>
              <p className="text-sm sm:text-base text-gray-700 font-normal leading-relaxed max-w-[240px]">
                2715 Ash Dr. San Jose, South Dakota 83475
              </p>
            </div>

           
            <div className="py-7 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#EDF2EE] text-[#00B207] flex items-center justify-center mb-3">
                <Mail size={24} strokeWidth={1.75} />
              </div>
              <a
                href="mailto:Proxy@gmail.com"
                className="text-sm sm:text-base text-gray-700 font-normal hover:text-[#00B207] transition-colors"
              >
                Proxy@gmail.com
              </a>
              <a
                href="mailto:Help.proxy@gmail.com"
                className="text-sm sm:text-base text-gray-700 font-normal hover:text-[#00B207] transition-colors mt-0.5"
              >
                Help.proxy@gmail.com
              </a>
            </div>

            {/* Phone */}
            <div className="pt-7 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#EDF2EE] text-[#00B207] flex items-center justify-center mb-3">
                <Phone size={24} strokeWidth={1.75} />
              </div>
              <a
                href="tel:2195550114"
                className="text-sm sm:text-base text-gray-700 font-normal hover:text-[#00B207] transition-colors"
              >
                (219) 555-0114
              </a>
              <a
                href="tel:1543330487"
                className="text-sm sm:text-base text-gray-700 font-normal hover:text-[#00B207] transition-colors mt-0.5"
              >
                (154) 333-0487
              </a>
            </div>
          </div>

          {/* Right Form Card (8 Columns) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Just Say Hello!
            </h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-xl">
              Do you fancy saying hi to me or you want to get started with your project and you need my help? Feel free to contact me.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Template Cookie"
                    className="w-full text-sm border border-gray-200 rounded-lg px-4 py-3.5 outline-none text-gray-800 placeholder-gray-400 focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207] transition"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="zakirsoft@gmail.com"
                    className="w-full text-sm border border-gray-200 rounded-lg px-4 py-3.5 outline-none text-gray-800 placeholder-gray-400 focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207] transition"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Hello!"
                  className="w-full text-sm border border-gray-200 rounded-lg px-4 py-3.5 outline-none text-gray-800 placeholder-gray-400 focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207] transition"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  required
                  placeholder="Subjects"
                  className="w-full text-sm border border-gray-200 rounded-lg p-4 outline-none text-gray-800 placeholder-gray-400 focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207] transition resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-[#00B207] hover:bg-[#009606] text-white px-9 py-3.5 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-98"
                >
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Full-width Interactive React Leaflet Map */}
      <div className="w-full h-[450px] relative z-0 border-t border-b border-gray-100 overflow-hidden">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%", zIndex: 1 }}
        >
          <RecenterMap position={position}/>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={customIcon}>
            <Popup>
              <div className="p-1 text-center">
                <p className="font-bold text-[#00B207] text-sm">
          {isCurrentLocation ? "Your Current Location" : "Ecobazar Grocery"}
        </p>
            <p className="text-xs text-gray-600 mt-0.5">
          {isCurrentLocation
            ? `Lat: ${position[0].toFixed(4)}, Lng: ${position[1].toFixed(4)}`
            : "2715 Ash Dr. San Jose, South Dakota 83475"}
        </p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
}
