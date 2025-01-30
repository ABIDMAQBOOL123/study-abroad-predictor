const Auth = require("../models/authModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const user = await Auth.create({ name, email, password: hashedPassword });

    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(400).json({ error: error.message });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    
    const user = await Auth.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    
    console.log("User Found:", user);
    console.log("Password Received:", password);

    
    if (password === undefined || user.password === undefined) {
      return res.status(400).json({ error: "Password is undefined" });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET is not defined" });
    }

    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser };
