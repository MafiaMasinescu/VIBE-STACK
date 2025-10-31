import express from "express";
import notesRoutes from "./routes/notesRoutes.js";  
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app= express();
const PORT = process.env.PORT;



//middleware 
app.use(express.json()); // this middleware will parse JSON bodies: req.body
app.use(rateLimiter);

app.use("/api/notes", notesRoutes);

connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log("Server started on port:", PORT);
    });
});


