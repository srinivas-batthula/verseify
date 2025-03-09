const express = require("express");
const router = express.Router();
const { createOrder, paymentVerify } = require("../controllers/PaymentController");


router.post("/order", createOrder)
router.post('/verify', paymentVerify)


module.exports = router