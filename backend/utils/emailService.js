// ========================================
// 🌸 EverBloom — Email Service for OTP
// ========================================
const nodemailer = require("nodemailer");

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create email transporter
const createTransporter = () => {
  // Using Gmail as example - configure with your email service
  // For production, use environment variables
  return nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "your-email@gmail.com",
      pass: process.env.EMAIL_PASSWORD || "your-app-password",
    },
  });
};

// Send OTP email
const sendOTP = async (email, fullName) => {
  try {
    const otp = generateOTP();
    
    // Store OTP with 10-minute expiration
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@everbloom.co.za",
      to: email,
      subject: "🌸 EverBloom - Email Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #b91c1c;">Welcome to EverBloom! 🌸</h2>
          <p>Hi ${fullName},</p>
          <p>Thank you for signing up with EverBloom. To complete your registration, please use the verification code below:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #b91c1c; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
          <p style="color: #666; font-size: 12px;">
            EverBloom - Fresh Flowers, Always<br>
            <a href="https://everbloomshop.co.za" style="color: #b91c1c;">everbloomshop.co.za</a>
          </p>
        </div>
      `,
    };

    // In development mode, just log the OTP instead of sending email
    if (process.env.NODE_ENV === "development") {
      console.log(`\n🔐 OTP for ${email}: ${otp}\n`);
      return { success: true, message: "OTP logged (development mode)" };
    }

    await transporter.sendMail(mailOptions);
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("❌ Email send error:", error);
    throw new Error("Failed to send OTP email");
  }
};

// Verify OTP
const verifyOTP = (email, otp) => {
  const storedData = otpStore.get(email);

  if (!storedData) {
    return { valid: false, message: "No OTP found for this email" };
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(email);
    return { valid: false, message: "OTP has expired" };
  }

  if (storedData.otp !== otp) {
    return { valid: false, message: "Invalid OTP" };
  }

  // OTP is valid, remove it
  otpStore.delete(email);
  return { valid: true, message: "OTP verified successfully" };
};

module.exports = {
  sendOTP,
  verifyOTP,
};
