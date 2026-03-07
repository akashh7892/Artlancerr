import { useEffect } from "react";
import { paymentsAPI } from "../../services/api";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(window.Razorpay);
    document.body.appendChild(script);
  });
};

export default function RazorpayCheckout({
  amount,
  artistId,
  taskId,
  opportunityId,
  description,
  projectName,
  onSuccess,
  onClose,
  keyId,
}) {
  const key = keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;

  useEffect(() => {
    if (!key) {
      onSuccess?.({ error: "Razorpay key not configured" });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const orderData = await paymentsAPI.createOrder({
          amount: Number(amount),
          artistId: artistId || undefined,
          taskId: taskId || undefined,
          opportunityId: opportunityId || undefined,
          description: description || "Payment",
          projectName: projectName || undefined,
        });
        if (cancelled) return;
        const Razorpay = await loadRazorpayScript();
        const options = {
          key,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          order_id: orderData.orderId,
          name: "Flip",
          description: description || "Payment",
          handler: async (res) => {
            try {
              const verifyRes = await paymentsAPI.verify({
                razorpay_order_id: res.razorpay_order_id,
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_signature: res.razorpay_signature,
              });
              onSuccess?.(verifyRes.payment);
            } catch (err) {
              onSuccess?.({ error: err.message });
            }
          },
          modal: { ondismiss: () => onClose?.() },
        };
        const rzp = new Razorpay(options);
        rzp.open();
      } catch (err) {
        if (!cancelled)
          onSuccess?.({ error: err.message || "Failed to create order" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
