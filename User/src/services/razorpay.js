// Helper to dynamically load Razorpay Checkout SDK script
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Orchestrate Razorpay checkout modal
export const openRazorpayCheckout = async ({
  amount,
  itemsCount,
  customerName,
  email,
  phone,
  address,
  createOrderFn,
  onSuccess,
  onCancel,
  onError,
}) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    throw new Error("Unable to load Razorpay payment SDK. Please check your internet connection.");
  }

  const rzpOrderResponse = await createOrderFn({ amount });
  if (!rzpOrderResponse?.success || !rzpOrderResponse?.order) {
    throw new Error(rzpOrderResponse?.message || "Failed to initialize payment gateway order.");
  }

  const rzpOrder = rzpOrderResponse.order;
  const razorpayKey = rzpOrderResponse.key_id || "rzp_test_Tf4WvxbMmFt0Pb";

  const options = {
    key: razorpayKey,
    amount: rzpOrder.amount,
    currency: rzpOrder.currency || "INR",
    name: "Ecobazar Grocery",
    description: `Payment for ${itemsCount} item(s)`,
    order_id: rzpOrder.id,
    prefill: {
      name: customerName,
      email,
      contact: phone,
    },
    notes: {
      address,
    },
    theme: {
      color: "#00B207",
    },
    handler: onSuccess,
    modal: {
      ondismiss: onCancel,
    },
  };

  const rzp = new window.Razorpay(options);
  if (onError) {
    rzp.on("payment.failed", onError);
  }
  rzp.open();
};
