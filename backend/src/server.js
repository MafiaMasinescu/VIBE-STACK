import express from "express";
import cors from "cors";
import notesRoutes from "./routes/notesRoutes.js";  
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
// import rateLimiter from "./middleware/rateLimiter.js"; // Temporarily disabled - add Upstash credentials to enable

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware 
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // this middleware will parse JSON bodies: req.body
// app.use(rateLimiter); // Temporarily disabled - add Upstash credentials to enable

app.use("/api/notes", notesRoutes);
app.use("/api/auth", authRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started successfully on port: ${PORT}`);
    });
});


