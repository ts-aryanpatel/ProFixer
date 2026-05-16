import express from 'express';
import * as providerAuthController from "../controllers/providerAuth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { providerRegisterSchema, providerLoginSchema } from "../validators/provider.validator.js";
import { verifyProvider } from "../middlewares/auth.middleware.js";

const router = express.Router();


// POST  /api/provider/auth/register
router.post("/register", validate(providerRegisterSchema), providerAuthController.register);

// POST  /api/provider/auth/login
router.post("/login", validate(providerLoginSchema), providerAuthController.login);

// GET  /api/provider/auth/refresh-token
router.get("/refresh-token", providerAuthController.refreshToken);

// GET  /api/provider/auth/logout
router.get("/logout", verifyProvider, providerAuthController.logout);

// GET  /api/provider/auth/logout-all
router.get("/logout-all", verifyProvider, providerAuthController.logoutAll);

export default router;