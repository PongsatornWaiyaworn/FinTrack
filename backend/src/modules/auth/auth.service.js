const { db } = require("../../config/db");
const { hashPassword, comparePassword } = require("../../utils/hash");
const { signToken } = require("../../utils/jwt");
const { generateOTP, hashOTP, compareOTP } = require("../../utils/otp");
const { sendOTPEmail } = require("../../utils/mailer");
const { AuthSQL } = require("./auth.sql");
const { DEFAULT_CATEGORIES } = require("../../constant/defaultCategories");

async function registerService(email, password) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const existing = await client.query(
      AuthSQL.findUserByEmail,
      [email]
    );

    if (existing.rowCount > 0) {
      const user = existing.rows[0];

      if (user.is_verified) {
        await client.query("ROLLBACK");
        return {
          success: false,
          status: "ALREADY_VERIFIED",
          message: "Email already registered and verified",
        };
      }

      const otp = generateOTP();
      const otpHash = await hashOTP(otp);

      await client.query(AuthSQL.createOTP, [user.id, otpHash]);
      await sendOTPEmail(user.email, otp);

      await client.query("COMMIT");

      return {
        success: true,
        status: "OTP_RESENT",
        message: "OTP resent to email",
        data: { userId: user.id },
      };
    }

    const hashedPassword = await hashPassword(password);

    const userResult = await client.query(
      AuthSQL.createUser,
      [email, hashedPassword]
    );

    const user = userResult.rows[0];

    for (const cat of DEFAULT_CATEGORIES) {
      await client.query(
        `INSERT INTO categories (user_id, name, color)
         VALUES ($1, $2, $3)`,
        [user.id, cat.name, cat.color]
      );
    }

    const otp = generateOTP();
    const otpHash = await hashOTP(otp);

    await client.query(AuthSQL.createOTP, [user.id, otpHash]);
    await sendOTPEmail(user.email, otp);

    await client.query("COMMIT");

    return {
      success: true,
      status: "OTP_SENT",
      message: "OTP sent to email",
      data: { userId: user.id },
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

/* =========================
   Login
========================= */
async function loginService(email, password) {
  const result = await db.query(AuthSQL.findUserByEmail, [email]);

  if (result.rowCount === 0) {
    throw new Error("Invalid credentials");
  }

  const user = result.rows[0];

  if (!user.is_verified) {
    throw new Error("Please verify your email first");
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
  });

  return {
    user: { id: user.id, email: user.email },
    token,
  };
}

/* =========================
   Verify OTP
========================= */
async function verifyOtpService(email, otp) {
  const userResult = await db.query(AuthSQL.findUserByEmail, [email]);

  if (userResult.rowCount === 0) {
    throw new Error("User not found");
  }

  const user = userResult.rows[0];

  const otpResult = await db.query(AuthSQL.findLatestOTPByUser, [user.id]);

  if (otpResult.rowCount === 0) {
    throw new Error("OTP not found");
  }

  const record = otpResult.rows[0];

  if (record.used) throw new Error("OTP already used");
  if (new Date(record.expires_at) < new Date())
    throw new Error("OTP expired");

  const isValid = await compareOTP(otp, record.otp_hash);
  if (!isValid) throw new Error("Invalid OTP");

  await db.query(AuthSQL.markUserVerified, [user.id]);
  await db.query(AuthSQL.markOTPUsed, [record.id]);

  return { message: "Email verified successfully" };
}

/* =========================
   Resend OTP
========================= */
async function resendOtpService(email) {
  const userResult = await db.query(AuthSQL.findUserByEmail, [email]);

  if (userResult.rowCount === 0) {
    return {
      success: false,
      status: "USER_NOT_FOUND",
      message: "User not found",
    };
  }

  const user = userResult.rows[0];

  if (user.is_verified) {
    return {
      success: false,
      status: "ALREADY_VERIFIED",
      message: "Email already verified",
    };
  }

  const lastOtp = await db.query(AuthSQL.findLatestOTPByUser, [user.id]);

  if (lastOtp.rows.length > 0) {
    const diff = Date.now() - new Date(lastOtp.rows[0].created_at).getTime();
    if (diff < 60 * 1000) {
      return {
        success: false,
        status: "TOO_FAST",
        message: "Please wait 1 minute before requesting a new OTP",
      };
    }
  }

  const otp = generateOTP();
  const otpHash = await hashOTP(otp);

  await db.query(AuthSQL.createOTP, [user.id, otpHash]);
  await sendOTPEmail(user.email, otp);

  return {
    success: true,
    status: "OTP_RESENT",
    message: "New OTP sent to email",
  };
}

module.exports = {
  registerService,
  loginService,
  verifyOtpService,
  resendOtpService,
};
