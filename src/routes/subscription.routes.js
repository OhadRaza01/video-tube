import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import { toggleSubscription } from "../controllers/subscription.controller.js";



const router = Router()

router.use(jwtVerify)

router.route("/c/:channelId").post(toggleSubscription)


export default router