import express from "express";
import notesRoutes from "./routes/notesRoutes.js";  
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app= express();
const PORT = process.env.PORT;



//middleware 
app.use(express.json()); // this middleware will parse JSON bodies: req.body
app.use(rateLimiter);

// allow CORS for local frontend dev
app.use(cors());

app.use("/api/notes", notesRoutes);
app.use("/api/auth", authRoutes);

connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log("Server started on port:", PORT);
    });
});


