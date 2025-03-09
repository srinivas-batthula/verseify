require("dotenv").config({ path: './config.env' })
const razorpay = require('../razorpayConfig')
const crypto = require('crypto')


// Create Payment Route
exports.createOrder = async (req, res) => {
    const { amount } = req.body

    // console.log(amount)

    if (!amount) {
        return res.status(400).json({ success: false, details: 'Amount Not Entered!' })
    }

    try {
        const options = {
            amount: amount * 100, // Convert to paise
            currency: "INR",
            receipt: `order_rcptid_${Date.now()}`,
        }
        const order = await razorpay.orders.create(options)
        return res.status(201).json(order)
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, details: error.message })
    }
}


// Verify Payment Route
exports.paymentVerify = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature){
        return res.status(400).json({success: false, details: 'Enter all details!'})
    }
    // console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature)

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        res.status(200).json({ success: true, details: "Payment verified successfully" });
    } else {
        res.status(403).json({ success: false, details: "Payment verification failed" });
    }
}
