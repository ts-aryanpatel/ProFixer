import express from "express";
import cors from 'cors';
import providerAuthRoutes from "./routes/provider.auth.routes.js";
import providerRoutes from "./routes/provider.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import customerAuthRoutes from "./routes/customer.auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));


app.use("/api/provider/auth", providerAuthRoutes);
app.use("/api/provider/profile", providerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/booking", bookingRoutes);


app.use("/api/customer", customerAuthRoutes);


app.use(errorHandler);

export default app;