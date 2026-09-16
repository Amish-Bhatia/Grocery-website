import React from "react";
import { Link } from "react-router-dom";
import { PhoneCall, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#1A1A1A", color: "#999999", paddingTop: "48px", paddingBottom: "24px", fontFamily: "var(--nav-font)" }}>
      <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "32px", marginBottom: "40px" }}>
          {/* Brand Col */}
          <div>
            <Link to="/" style={{ textDecoration: "none" }}>
              <img
                src="/Logo.svg"
                alt="Ecobazar"
                style={{ height: "32px", marginBottom: "16px", filter: "brightness(0) invert(1)" }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </Link>
            <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#808080", marginTop: "8px" }}>
              Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis dui, eget bibendum magna congue nec.
            </p>
            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#FFFFFF" }}>
                <PhoneCall size={16} color="#00B207" />
                <span>(219) 555-0114</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#808080" }}>
                <Mail size={16} color="#00B207" />
                <span>support@ecobazar.com</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#808080" }}>
                <MapPin size={16} color="#00B207" />
                <span>Lincoln- 344, Illinois, Chicago, USA</span>
              </div>
            </div>
          </div>

          {/* My Account */}
          <div>
            <h4 style={{ color: "#FFFFFF", fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>My Account</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
              <li><Link to="/login" style={{ color: "#999", textDecoration: "none" }}>My Account</Link></li>
              <li><Link to="/cart" style={{ color: "#999", textDecoration: "none" }}>Shopping Cart</Link></li>
              <li><Link to="/shop" style={{ color: "#999", textDecoration: "none" }}>Shop All Products</Link></li>
              <li><Link to="/about" style={{ color: "#999", textDecoration: "none" }}>About Store</Link></li>
            </ul>
          </div>

          {/* Helps */}
          <div>
            <h4 style={{ color: "#FFFFFF", fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>Helps & Info</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
              <li><Link to="/contact" style={{ color: "#999", textDecoration: "none" }}>Contact Us</Link></li>
              <li><Link to="/terms" style={{ color: "#999", textDecoration: "none" }}>Terms & Conditions</Link></li>
              <li><Link to="/privacy" style={{ color: "#999", textDecoration: "none" }}>Privacy Policy</Link></li>
              <li><Link to="/about" style={{ color: "#999", textDecoration: "none" }}>Track Order</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color: "#FFFFFF", fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>Subscribe Our Newsletter</h4>
            <p style={{ fontSize: "13px", color: "#808080", marginBottom: "14px", lineHeight: "1.5" }}>
              Subscribe now to get special offers and updates right into your inbox.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Thank you for subscribing!"); }} style={{ display: "flex" }}>
              <input
                type="email"
                placeholder="Your email address"
                required
                style={{
                  padding: "10px 14px",
                  fontSize: "13px",
                  border: "1px solid #333333",
                  background: "#262626",
                  color: "#FFF",
                  borderRadius: "5px 0 0 5px",
                  outline: "none",
                  flex: 1,
                }}
              />
              <button
                type="submit"
                style={{
                  background: "#00B207",
                  color: "#FFF",
                  border: "none",
                  padding: "0 18px",
                  borderRadius: "0 5px 5px 0",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: "1px solid #2C2C2C", paddingTop: "20px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", fontSize: "13px", color: "#666666" }}>
          <div>
            Ecobazar eCommerce &copy; {new Date().getFullYear()}. All Rights Reserved
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <Link to="/terms" style={{ color: "#666", textDecoration: "none" }}>Terms</Link>
            <Link to="/privacy" style={{ color: "#666", textDecoration: "none" }}>Privacy</Link>
            <Link to="/contact" style={{ color: "#666", textDecoration: "none" }}>Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
