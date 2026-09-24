const razorpay = require('razorpay');
const crypto = require('crypto')

const Razorpay = new razorpay({
    key_id: process.env.Key_id,
    key_secret: process.env.Secret_key,
});

const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid Amount",
      });
    }

    const options = {
      amount: Math.round(numAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    try {
      const order = await Razorpay.orders.create(options);
      res.status(200).json({
        success: true,
        order,
        key_id: process.env.Key_id,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const getRazorpayKey = (req, res) => {
  res.status(200).json({ key_id: process.env.Key_id });
};
const verifyOrder = async (req , res) =>{

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    } = req.body;

    try{
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = 
        crypto.createHmac("sha256",process.env.Secret_key)
        .update(body.toString())
        .digest("hex");

        if(expectedSignature === razorpay_signature)
        {
            res.status(200).json({
                success : true,
                message:"Payment Verified",
            });
        }

        else {
            res.status(400).json({
                success : false,
                message:"Payment Failed",
            });
        }
    }

    catch(error)  
    {
        res.status(500).json({
            success : false,
            message:error.message || "Internal Server Error",
        });
    }
}
module.exports = { createOrder, verifyOrder, getRazorpayKey };