import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import { getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";



const router = Router()

router.use(jwtVerify)

router.route("/c/:channelId")
.get(getUserChannelSubscribers)
.post(toggleSubscription)


export default router