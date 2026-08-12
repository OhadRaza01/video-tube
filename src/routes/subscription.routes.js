import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";



const router = Router()

router.use(jwtVerify)

router.route("/c/:channelId")
.get(getUserChannelSubscribers)
.post(toggleSubscription)

router.route("/u/:subscriberId").get(getSubscribedChannels);

export default router