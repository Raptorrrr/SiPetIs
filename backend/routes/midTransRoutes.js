import express from 'express'
const router = express.Router()

import {protect, admins} from "../middleware/authMiddleware.js";
import midtrans from "../config/midtrans.js";
import Order from "../models/orderModel.js";

router.route('/:orderId').get(protect, midtrans)
router.route('/success').post(async (req,res)=>{
    const order = await Order.findById(req.body.order_id)

    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            transaction_id:req.body.transaction_id,
            method:req.body.payment_type,
            status: req.body.fraud_status,
            transaction_time: req.body.transaction_time,
        }

        const updatedOrder = await order.save()

        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})


export default router