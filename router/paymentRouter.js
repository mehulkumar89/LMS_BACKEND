import { Router } from "express"
import {getRazorpaykey,verifySubscription,cancelSubscription,allpayment,buysubscription} from "../controller/paymentcontroller.js"
import {autharized,isauthorized} from "../middleware/user_middleware.js"
const router = Router()
router
    .route('/razorpay-key')
    .get(
        autharized,
        getRazorpaykey
        )

router
    .route('/subscribe')
    .post(
        autharized,
        buysubscription
        )
router
     .route('/verify') 
     .post(
        autharized,
        verifySubscription
     )       

router
    .route('/unsubscribe')
    .post(
        autharized,
        cancelSubscription
        )
router
    .route('/')
    .get(
        autharized,
        isauthorized('ADMIN'),
        allpayment
        )
    
export default router    