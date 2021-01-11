import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import midtransclient from 'midtrans-client';


const generatepaymentmidtrans = asyncHandler(async (req, res) => {

    console.log(req.user)
    const snap = new midtransclient.Snap({
        isProduction: true,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
    })

    console.log(process.env.MIDTRANS_SERVER_KEY)
    const order = await Order.findById(req.params.orderId)
    console.log(order)

    const parameter = {
        "transaction_details": {
            order_id: order._id,
            gross_amount: parseInt(order.totalPrice) * 14000
        },
        "credit_card": {
            "secure": true
        },
        "customer_details": {
            first_name: req.user.name,
            last_name: req.user.name,
            email: req.user.email,
            phone: 0
        }
    };

    try {
        const transaction = await snap.createTransaction(parameter)
        const transactionToken = transaction.token;
        res.json({transactionToken})

    } catch (e) {
        console.log(e.message)
        res.send("Error")

    }


})

export default generatepaymentmidtrans;