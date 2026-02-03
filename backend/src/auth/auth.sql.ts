export const AuthSQL = {
  // ===== USERS =====
  findUserByEmail: `
    SELECT id, email, password, is_verified
    FROM users
    WHERE email = $1
  `,

  createUser: `
    INSERT INTO users (email, password, is_verified)
    VALUES ($1, $2, false)
    RETURNING id, email
  `,

  markUserVerified: `
    UPDATE users
    SET is_verified = true
    WHERE id = $1
  `,

  // ===== OTP =====
  createOTP: `
    INSERT INTO otps (user_id, otp_hash, expires_at)
    VALUES ($1, $2, now() + interval '5 minutes')
  `,

  findLatestOTPByUser: `
    SELECT id, otp_hash, expires_at, used
    FROM otps
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 1
  `,

  markOTPUsed: `
    UPDATE otps
    SET used = true
    WHERE id = $1
  `,

  deleteUserOTPs: `
    DELETE FROM otps
    WHERE user_id = $1
  `,
};
