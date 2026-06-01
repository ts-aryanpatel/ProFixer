import express from "express";
import { verifyCustomer } from "../middlewares/auth.middleware.js";
import * as customerProfileController from "../controllers/customerProfile.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { validateObjectId } from "../middlewares/validateObjectId.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyCustomer);

// GET /api/customer/profile
router.get("/profile", customerProfileController.getProfile);

// PATCH /api/customer/profile/update
router.patch("/profile/update", validate({}), customerProfileController.profileUpdate);

// PATCH /api/customer/change-password
router.patch("/change-password", customerProfileController.changePassword);

// DELETE /api/customer/delete-account
router.delete("/delete-account", customerProfileController.deleteAccount);

export default router;
