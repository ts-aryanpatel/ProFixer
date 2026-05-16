import express from 'express';
import { registerCustomer, loginCustomer, refreshToken, logout, logoutAll } from "../controllers/customerAuth.controller.js";
import { verifyCustomer } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerCustomerSchema, loginCustomerSchema } from "../validators/customer.validator.js";
const router = express.Router();


router.post("/register", validate(registerCustomerSchema), registerCustomer);
router.post("/login", validate(loginCustomerSchema), loginCustomer);
router.post("/refresh-token", refreshToken);


router.post("/logout", verifyCustomer, logout);
router.post("/logout-all",verifyCustomer, logoutAll);

export default router;