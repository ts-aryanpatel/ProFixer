import express from "express";
import { verifyProvider } from "../middlewares/auth.middleware.js";
import * as serviceController from "../controllers/service.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addServiceSchema, updateSeviceSchema } from "../validators/service.validator.js";

const router = express.Router();

router.use(verifyProvider);


// POST  /api/services/add
router.post("/add", validate(addServiceSchema), serviceController.addServices);

// PATCH  /api/services/update/:id
router.patch("/update/:id", validate(updateSeviceSchema), serviceController.updateService);

// GET  /api/services/my-services
router.get("/my-services", serviceController.getAllServices);

// DELETE  /api/services/delete/:id
router.delete("/delete/:id", serviceController.deleteService);

// GET  /api/services/suggestions
router.get("/suggestions", serviceController.getServiceSuggestion);


export default router;
