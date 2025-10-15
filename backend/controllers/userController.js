import User from "../models/User.js";
import bcrypt from "bcryptjs";

// CREATE USER
export const createUser = async (req, res) => {
  try {
    const { name, contactNo, email, password, address } = req.body;
    if (!name || !contactNo || !email || !password)
      return res.status(400).json({ message: "Name, Contact No, Email, and Password are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const newUser = await User.create({ name, contactNo, email, password, address });
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE USER
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { name, contactNo, email, password, address } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.contactNo = contactNo || user.contactNo;
    user.email = email || user.email;
    user.address = address || user.address;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.remove();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
