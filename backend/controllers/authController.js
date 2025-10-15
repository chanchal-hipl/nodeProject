import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const missingFields = [];
    if (!name) missingFields.push("Name");
    if (!email) missingFields.push("Email");
    if (!password) missingFields.push("Password");

    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Missing field(s): ${missingFields.join(", ")}` });
    }

    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ message: "Name must be a valid string with at least 2 characters." });
    }
    const existingName = await User.findOne({ name });
    if (existingName) {
      return res.status(400).json({ message: "Name already exists." });
    }
    const emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format. Example: user@example.com" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{1,8}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be max 8 characters and include at least one letter, one number, and one special character.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ name, email, password });

    res.status(201).json({ message: "User registered successfully." });

  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email && !password)
      return res.status(400).json({ message: "Email and password required" });
    if (!email)
      return res.status(400).json({ message: "Email is required" });
    if (!password)
      return res.status(400).json({ message: "Password is required" });

    const emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email format" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email }, });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const dashboard = (req, res) => {
  res.json({ message: `Welcome ${req.user.name} to the Dashboard!` });
};
