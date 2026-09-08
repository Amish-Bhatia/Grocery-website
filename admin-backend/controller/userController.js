const Users = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const transporter = require("../config/mailer");

const { forgotPassword, Sendotp } = require("../Template/template");



const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const check = await Users.findOne({
      email,
      // role: "admin"
    });

    if (!check) {
      return res.status(401).json({
        message: "Invalid email"
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      check.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    // Generate OTP
    const otp = Math.floor( 100000 + Math.random() * 900000 ).toString();

    check.otp = otp;
    await check.save();

    // Send OTP email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your OTP Code",
      html: Sendotp(otp)
    });

    return res.status(200).json({
      message: "OTP sent to your email",
        user: {
    name: check.name,
    email: check.email
  }
    });

  } catch (e) {
    console.log(e);

    return res.status(500).json({
      message: "Unable to login"
    });
  }
};



const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const check = await Users.findOne({
      email,
      role: "admin"
    });

    if (!check) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    if (!check.otp || otp !== check.otp) {
      return res.status(401).json({
        message: "Invalid OTP"
      });
    }

   
    check.otp = undefined;
    await check.save();

   
    const token = jwt.sign(
      {
        userId: check.id,
        email: check.email,
        role: check.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

  
    return res.status(200).json({
      message: "OTP verified successfully",
      token,
      user: {
    id: check._id,
    name: check.name,
    email: check.email,
    role: check.role
  }
    });

  } catch (e) {
    console.log(e);

    return res.status(500).json({
      message: e.message
    });
  }
};


const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Enter email"
      });
    }

    const user = await Users.findOne({
      email,
      role: "admin"
    });

    if (!user) {
      return res.status(400).json({
        message: "Please enter a valid email"
      });
    }

  
    const resetToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        purpose: "password-reset"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m"
      }
    );

    const resetLink =
      `http://localhost:5173/change?token=${resetToken}`;

    // Send forgot password email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Reset Your Password",
      html: forgotPassword(resetLink)
    });

    return res.status(200).json({
      message: "Password reset link sent to your email"
    });

  } catch (e) {
    console.log(e);

    return res.status(500).json({
      message: e.message
    });
  }
};
const resetpassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Reset token is required"
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Enter new password"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.purpose !== "password-reset") {
      return res.status(401).json({
        message: "Invalid reset token"
      });
    }

    const user = await Users.findOne({
      _id: decoded.userId,
      email: decoded.email,
      role: "admin"
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully"
    });

  } catch (e) {
    console.log(e);

    if (e.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Reset link has expired"
      });
    }

    if (e.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid reset token"
      });
    }

    return res.status(500).json({
      message: e.message
    });
  }
};


module.exports = {
  login,
  verifyOtp,
  forgotpassword,
  resetpassword
};
