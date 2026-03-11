const Razorpay = require('razorpay');

let razorpay;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.warn("RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing. Razorpay integration disabled.");
  // Export a mock object to prevent crashes on import
  razorpay = {
    orders: {
      create: async () => { throw new Error("Razorpay is not configured on this server."); }
    }
  };
}

module.exports = razorpay;
