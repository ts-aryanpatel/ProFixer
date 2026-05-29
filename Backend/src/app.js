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
const allowedOrigins = [
  "http://localhost:5173",                 // Local development ke liye
  "https://profixer-tau.vercel.app"        // Aapka Vercel deployment URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Agar request bina origin ke ho (jaise Postman ya mobile apps), to allow karein
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy se yeh origin allowed nahi hai!'));
    }
  },
  credentials: true
}));


app.use("/api/provider/auth", providerAuthRoutes);
app.use("/api/provider/profile", providerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/booking", bookingRoutes);


app.use("/api/customer", customerAuthRoutes);


app.use(errorHandler);

export default app;