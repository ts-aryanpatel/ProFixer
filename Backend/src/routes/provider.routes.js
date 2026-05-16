import express from "express";
import { verifyProvider } from "../middlewares/auth.middleware.js";
import * as providerProfileController from "../controllers/providerProfile.controller.js";
import { updateProfileSchema, changePasswordSchema } from "../validators/provider.validator.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.use(verifyProvider);

// GET  /api/provider/profile/me
router.get("/me", providerProfileController.getProfile);

// PATCH  /api/provider/profile/update
router.patch("/update", validate(updateProfileSchema), providerProfileController.updateProfile);


// PATCH  /api/provider/profile/toggle-status
router.patch("/toggle-status", providerProfileController.isOnline);


//PATCH   /api/provider/profile/change-password
router.patch("/change-password", validate(changePasswordSchema), providerProfileController.changePassword);


export default router;