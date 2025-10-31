import User from "../moodels/User.js";
import bcrypt from "bcrypt";

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashed });
    await user.save();

    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error("Error in register", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
