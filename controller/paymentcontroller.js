import User from "../model/user_model.js"
import AppError from "../util/error.js"
import { razorpay } from "../server.js"
import crypto from "crypto"
import payment from "../model/payment_model.js"
const getRazorpaykey = async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'fetched API key',
        API_KEY: process.env.RAZOR_PAY_API
    })
}
const buysubscription = async (req, res, next) => {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user) {
        return next(new AppError('user unauthorized', 400))
    }
    if (user.role === 'ADMIN') {
        return next(new AppError('Admin cannot Subscribe the course'), 400)
    }
    try {
        const subscription = await razorpay.subscriptions.create({
            plan_id: process.env.RAZOR_PAY_PLAN_ID,
            customer_notify: 1,
            total_count: 3
        })
        user.subscription.id = subscription.id
        user.subscription.status = subscription.status
        await user.save()
        res.status(200).json({
            success: true,
            message: 'subscribed successfully',
            subscription_id: subscription.id
        })
    }
    catch (e) {
        res.status(400).json({
            success: false,
            message: 'unable to subscribe',
        })
    }
}
const verifySubscription = async (req, res, next) => {
    const { id } = req.params;
    const { razorpay_payment_id, razorpay_subscription, razorpay_signature } = req.body
    const user = await User.findById(id)
    if (!user) {
        return next(new AppError('user unauthorized', 400))
    }
    try {
        const subscriptionId = user.subscription.id
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZOR_PAY_SECRET)
            .update(`${razorpay_payment_id}|${subscriptionId}`) 
            .digest('hex');
        if(generatedSignature!==razorpay_signature){
            return next(new AppError('payment not verify', 400))
        }

        await payment.create({
            razorpay_payment_id,
            razorpay_subscription,
            razorpay_signature
        })
        user.subscription.status = 'active'
        await user.save()
        res.status(200).json({
            success: true,
            message: 'payment verified successfully'
        })
    }
    catch (e) {
        return next(new AppError(e.message), 400)
    }

}
const cancelSubscription = async (req, res, next) => {
    const { id } = req.user
    const user = await User.findById(id)
    if (!user) {
        return next(new AppError('user Unautherized'), 400)
    }
    if (user.role == 'USER') {
        return next(new AppError('Admin cannot Cancle the subscription'), 400)
    }
    try {
        const subscription_id=user.subscription.id
        const cancelSubscription= await razorpay.subscriptions.cancel(
          subscription_id
        )

        user.subscription.status=cancelSubscription.status
        await user.save()
        res.status(200).json({
            success:true,
            message:'Subscription Cancle successfully'
        })

    }
    catch (e) {
        console.log(e)
        res.status(400).json({
            success:false,
            message:'Cancle Subscription failed'
        })
    }

}
const allpayment = async (req, res, next) => {
    const {count}=req.query
    try{
       const subscription= await razorpay.subscriptions.all({
        count:count || 10
       })
       res.status(200).json({
        success:true,
        message:'Cancle Subscription failed',
        subscription
    })

    }
    catch(e){
        return next(AppError(e.message,400))
    }
}

export {
    getRazorpaykey,
    buysubscription,
    verifySubscription,
    cancelSubscription,
    allpayment
}
