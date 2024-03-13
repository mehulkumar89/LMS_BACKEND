import { Router } from "express"
import {getRazorpaykey,verifySubscription,cancelSubscription,allpayment,buysubscription} from "../controller/paymentcontroller.js"
import {autharized,isauthorized} from "../middleware/user_middleware.js"
const router = Router()
router
    .route('/razorpay-key')
    .get(
        getRazorpaykey
        )

router
    .route('/subscribe/:id')
    .post(
        buysubscription
        )
router
     .route('/verify/:id') 
     .post(
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
