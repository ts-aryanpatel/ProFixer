import express from "express";
import providerAuthRoutes from "./routes/provider.auth.routes.js";
import providerRoutes from "./routes/provider.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json()); // Body parser: JSON data lene ke liye
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/provider/auth", providerAuthRoutes);
app.use("/api/provider/profile", providerRoutes);
app.use("/api/services", serviceRoutes);

app.use(errorHandler);

export default app;