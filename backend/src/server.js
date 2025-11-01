import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import notesRoutes from "./routes/notesRoutes.js";  
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const app= express();
const PORT = process.env.PORT;



//middleware 
// Allow cross-origin requests from Vite dev server and allow credentials (cookies)
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
}));

app.use(express.json()); // this middleware will parse JSON bodies: req.body
app.use(rateLimiter);

app.use("/api/notes", notesRoutes);
app.use("/auth", authRoutes);
app.use("/api/posts", postRoutes);



connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log("Server started on port:", PORT);
    });
});


