const Users = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const transporter = require("../config/mailer");
const { forgotPassword, Sendotp } = require("../Template/template");

// SIGNUP — Customer registration
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const userName = name || email.split("@")[0];
    const existing = await Users.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({
      name: userName,
      email,
      password: hashedPassword,
      role: "customer",
      status: "active",
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Account created successfully!",
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Unable to create account" });
  }
};

// LOGIN — Storefront customers + Admin OTP 2FA
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const check = await Users.findOne({ email });
    if (!check) return res.status(401).json({ message: "Invalid email" });

    const passwordMatches = await bcrypt.compare(password, check.password);
    if (!passwordMatches) return res.status(401).json({ message: "Invalid password" });

    const origin = req.headers.origin || req.headers.referer || "";
    const isAdminOrigin = origin.includes(":5173");
    const isAdminOrStaff = check.role === "admin" || check.role === "staff";

    if (isAdminOrStaff || isAdminOrigin) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      check.otp = otp;
      await check.save();

      console.log(`\n[AUTH] Admin/Staff Login OTP for ${email}: ${otp}\n`);

      try {
        await transporter.sendMail({
          from: `"Grocery Admin Portal" <${process.env.SMTP_USER}>`,
          to: email,
          subject: "Your OTP Code for Admin Login",
          html: Sendotp(otp),
        });
      } catch (mailError) {
        console.error(`[AUTH] Failed to send OTP email to ${email}:`, mailError);
        return res.status(500).json({
          message: `Failed to send OTP email: ${mailError.message || "Delivery failed"}. (Dev OTP: ${otp})`,
        });
      }

      return res.status(200).json({
        message: "OTP sent to your email",
        user: { id: check._id, name: check.name, email: check.email, role: check.role },
      });
    }

    const token = jwt.sign(
      { userId: check.id, email: check.email, role: check.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: check.id, name: check.name, email: check.email, role: check.role },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Unable to login. Please try again." });
  }
};

// VERIFY OTP for Admin / Staff
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const check = await Users.findOne({ email });
    if (!check) return res.status(401).json({ message: "User not found" });
    if (!check.otp || otp !== check.otp) return res.status(401).json({ message: "Invalid OTP" });

    check.otp = undefined;
    await check.save();

    const token = jwt.sign(
      { userId: check.id, email: check.email, role: check.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "OTP verified successfully",
      token,
      user: { id: check._id, name: check.name, email: check.email, role: check.role },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: e.message });
  }
};

// FORGOT PASSWORD
const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Enter email" });

    const user = await Users.findOne({ email });
    if (!user) return res.status(400).json({ message: "Please enter a valid email" });

    const resetToken = jwt.sign(
      { userId: user.id, email: user.email, purpose: "password-reset" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const origin = req.headers.origin || req.headers.referer || "http://localhost:5174";
    const cleanOrigin = origin.replace(/\/+$/, "");
    const isUserFrontend = cleanOrigin.includes(":5174");
    const resetPath = isUserFrontend ? "/reset-password" : "/change";
    const resetLink = `${cleanOrigin}${resetPath}?token=${resetToken}`;

    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Reset Your Password",
        html: forgotPassword(resetLink),
      });
    } catch (mailErr) {
      console.warn("Mail send warning:", mailErr.message);
    }

    return res.status(200).json({
      message: "Password reset link sent to your email",
      resetLink,
      token: resetToken,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: e.message });
  }
};

// RESET PASSWORD
const resetpassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token) return res.status(400).json({ message: "Reset token is required" });
    if (!password) return res.status(400).json({ message: "Enter new password" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.purpose !== "password-reset") {
      return res.status(401).json({ message: "Invalid reset token" });
    }

    const user = await Users.findOne({ _id: decoded.userId, email: decoded.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (e) {
    console.error(e);
    if (e.name === "TokenExpiredError") return res.status(401).json({ message: "Reset link has expired" });
    if (e.name === "JsonWebTokenError") return res.status(401).json({ message: "Invalid reset token" });
    return res.status(500).json({ message: e.message });
  }
};

module.exports = {
  signup,
  login,
  verifyOtp,
  forgotpassword,
  resetpassword,
};
