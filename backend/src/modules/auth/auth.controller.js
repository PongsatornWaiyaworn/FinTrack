const {
  loginService,
  registerService,
  resendOtpService,
  verifyOtpService,
} = require("./auth.service");

const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "email and password are required" });
  }

  const data = await registerService(email, password);
  res.status(201).json(data); // { userId }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "email and password are required" });
  }

  const data = await loginService(email, password);
  res.json(data);
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "email and otp are required",
    });
  }

  try {
    const result = await verifyOtpService(email, otp);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const resendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "email is required",
    });
  }

  const result = await resendOtpService(email);
  res.json(result);
};

module.exports = {
  register,
  login,
  verifyOtp,
  resendOtp,
};
