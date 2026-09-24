import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PageBanner from "../Components/PageBanner";
import Newsletter from "../Components/Newsletter";
import BillingForm from "../Components/Checkout/BillingForm";
import OrderSummary from "../Components/Checkout/OrderSummary";
import OrderSuccess from "../Components/Checkout/OrderSuccess";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import apimethods from "../services/api";
import { openRazorpayCheckout } from "../services/razorpay";

export default function Checkout() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const {
    cartItems,
    cartTotal,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    discountPercent,
    cartFinalTotal,
  } = useCart();

  const [formData, setFormData] = useState({
    firstName: "Dianne",
    lastName: "Russell",
    companyName: "",
    streetAddress: "4140 Parker Rd. Allentown, New Mexico 31134",
    country: "United States",
    state: "Washington",
    zipCode: "20033",
    email: "dianne.russell@gmail.com",
    phone: "(603) 555-0123",
    shipToDifferent: false,
    orderNotes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Check if user is signed in, redirect if not
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token && !isLoggedIn) {
      Swal.fire({
        icon: "info",
        title: "Please Sign In",
        text: "You need to be signed in to checkout and place an order.",
        confirmButtonText: "Sign In Now",
        confirmButtonColor: "#00B207",
        allowOutsideClick: false,
      }).then(() => {
        navigate("/login?redirect=/checkout");
      });
    }
  }, [isLoggedIn, navigate]);

  // Autofill user information if logged in
  useEffect(() => {
    if (user) {
      const names = (user.name || "").trim().split(" ");
      setFormData((prev) => ({
        ...prev,
        firstName: names[0] || prev.firstName,
        lastName: names.slice(1).join(" ") || prev.lastName,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("userToken");
    if (!isLoggedIn && !token) {
      Swal.fire({
        icon: "warning",
        title: "Sign In Required",
        text: "Please sign in to place your order.",
        confirmButtonText: "Sign In",
        confirmButtonColor: "#00B207",
      }).then(() => {
        navigate("/login?redirect=/checkout");
      });
      return;
    }

    if (cartItems.length === 0) {
      return Swal.fire({
        icon: "warning",
        title: "Empty Cart",
        text: "You do not have any items in your cart to checkout.",
      });
    }

    if (!formData.firstName || !formData.streetAddress || !formData.phone) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all required billing information.",
      });
    }

    const customerFullName = `${formData.firstName} ${formData.lastName}`.trim();
    const shippingCost = 0;
    const finalTotal = Number(((cartFinalTotal ?? cartTotal) + shippingCost).toFixed(2));

    const baseOrderPayload = {
      items: cartItems.map((item) => ({
        id: item.id || item._id,
        productId: item.id || item._id,
        name: item.name || "Product",
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        image: item.image || "",
        category: item.category || "",
      })),
      products: cartItems.map((item) => ({
        productId: item.id || item._id,
        name: item.name || "Product",
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
      })),
      subtotal: cartTotal,
      discount: discountAmount,
      couponCode: appliedCoupon?.code || "",
      shipping: shippingCost,
      total: finalTotal,
      totalAmount: finalTotal,
      customerName: customerFullName,
      customerEmail: formData.email,
      shippingAddress: {
        customerName: customerFullName,
        phone: formData.phone,
        street: formData.streetAddress,
        city: `${formData.state}, ${formData.country} - ${formData.zipCode}`,
        email: formData.email,
        notes: formData.orderNotes,
      },
    };

    setIsSubmitting(true);

    // 1. ONLINE PAYMENT GATEWAY (RAZORPAY)
    if (paymentMethod === "Razorpay") {
      try {
        await openRazorpayCheckout({
          amount: finalTotal,
          itemsCount: cartItems.length,
          customerName: customerFullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.streetAddress,
          createOrderFn: (data) => apimethods.postApi("/create-order", data),
          onSuccess: async (response) => {
            try {
              setIsSubmitting(true);
              const verifyRes = await apimethods.postApi("/verify-order", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (!verifyRes?.success) {
                throw new Error(verifyRes?.message || "Payment verification failed.");
              }

              const orderRes = await apimethods.postApi("/place-order", {
                ...baseOrderPayload,
                paymentMethod: "Razorpay",
                paymentStatus: "paid",
                paymentDetails: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
              });

              if (orderRes?.order) {
                setOrderSuccess({
                  orderId: orderRes.order._id || orderRes.order.id,
                  total: finalTotal,
                  discount: discountAmount,
                  couponCode: appliedCoupon?.code || "",
                  paymentMethod: "Razorpay (Online Paid)",
                  paymentId: response.razorpay_payment_id,
                  shippingAddress: baseOrderPayload.shippingAddress,
                  items: [...cartItems],
                });
                clearCart();
                Swal.fire({
                  icon: "success",
                  title: "Payment Received!",
                  text: `Order placed successfully! Payment ID: ${response.razorpay_payment_id}`,
                  timer: 3000,
                  showConfirmButton: false,
                });
              }
            } catch (err) {
              Swal.fire({
                icon: "error",
                title: "Payment Error",
                text: err.data?.message || err.message || "Failed to complete order after payment.",
              });
            } finally {
              setIsSubmitting(false);
            }
          },
          onCancel: () => {
            setIsSubmitting(false);
            Swal.fire({
              icon: "info",
              title: "Payment Cancelled",
              text: "You cancelled the payment. Your order was not placed.",
              timer: 2500,
              showConfirmButton: false,
            });
          },
          onError: (fail) => {
            setIsSubmitting(false);
            Swal.fire({
              icon: "error",
              title: "Payment Failed",
              text: fail.error?.description || "Payment failed. Please try again.",
            });
          },
        });
      } catch (err) {
        setIsSubmitting(false);
        Swal.fire({
          icon: "error",
          title: "Payment Gateway Error",
          text: err.data?.message || err.message || "Could not launch payment gateway.",
        });
      }
      return;
    }

    // 2. CASH ON DELIVERY / PAYPAL
    try {
      const backendPayment = paymentMethod === "Paypal" ? "PayPal" : "COD";
      const res = await apimethods.postApi("/place-order", {
        ...baseOrderPayload,
        paymentMethod: backendPayment,
        paymentStatus: "pending",
      });

      if (res?.order) {
        setOrderSuccess({
          orderId: res.order._id || res.order.id,
          total: finalTotal,
          discount: discountAmount,
          couponCode: appliedCoupon?.code || "",
          paymentMethod,
          shippingAddress: baseOrderPayload.shippingAddress,
          items: [...cartItems],
        });
        clearCart();
      } else {
        throw new Error(res?.message || "Order placement failed");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Order Error",
        text: err.data?.message || err.response?.data?.message || err.message || "Failed to place order.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Success Screen
  if (orderSuccess) {
    return <OrderSuccess orderSuccess={orderSuccess} />;
  }

  // Checkout Form Screen
  return (
    <div className="w-full bg-white font-sans min-h-screen flex flex-col justify-between">
      <div>
        <PageBanner
          breadcrumbs={[
            { label: "Shopping Cart", path: "/cart" },
            { label: "Checkout" },
          ]}
        />

        <div className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <form onSubmit={handlePlaceOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <BillingForm formData={formData} onChange={handleInputChange} />

              <OrderSummary
                cartItems={cartItems}
                cartTotal={cartTotal}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                isSubmitting={isSubmitting}
                appliedCoupon={appliedCoupon}
                applyCoupon={applyCoupon}
                removeCoupon={removeCoupon}
                discountAmount={discountAmount}
                discountPercent={discountPercent}
                cartFinalTotal={cartFinalTotal}
              />
            </div>
          </form>
        </div>
      </div>

      <Newsletter />
    </div>
  );
}
