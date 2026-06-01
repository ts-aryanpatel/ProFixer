import express from "express";
import cors from 'cors';
import providerAuthRoutes from "./routes/provider.auth.routes.js";
import providerRoutes from "./routes/provider.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import customerAuthRoutes from "./routes/customer.auth.routes.js";
import customerProfileRoutes from "./routes/customer.profile.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

const isProduction = process.env.NODE_ENV === "production";

app.use(cors({
  origin: isProduction ? "https://profixer-tau.vercel.app" : "http://localhost:5173",
  credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/provider/auth", providerAuthRoutes);
app.use("/api/provider/profile", providerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/contact", contactRoutes);

app.use("/api/customer", customerAuthRoutes);
app.use("/api/customer", customerProfileRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

app.use(errorHandler);

export default app;