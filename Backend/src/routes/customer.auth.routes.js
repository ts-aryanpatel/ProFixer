import express from 'express';
import { registerCustomer, loginCustomer, refreshToken, logout, logoutAll } from "../controllers/customerAuth.controller.js";
import { profileUpdate, changePassword, getProfile, deleteAccount } from "../controllers/customerProfile.controller.js";
import { verifyCustomer } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerCustomerSchema, loginCustomerSchema, updateProfileSchema, changePasswordSchema } from "../validators/customer.validator.js";
import { loginLimiter, registerLimiter, refreshTokenLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();


router.post("/register", registerLimiter, validate(registerCustomerSchema), registerCustomer);
router.post("/login", loginLimiter, validate(loginCustomerSchema), loginCustomer);
router.post("/refresh-token", refreshTokenLimiter, refreshToken);


router.post("/logout", verifyCustomer, logout);
router.post("/logout-all",verifyCustomer, logoutAll);


router.get("/profile", verifyCustomer, getProfile);
router.put("/profile", verifyCustomer, validate(updateProfileSchema), profileUpdate);
router.put("/change-password", verifyCustomer, validate(changePasswordSchema), changePassword);
router.delete("/profile", verifyCustomer, deleteAccount);

export default router;