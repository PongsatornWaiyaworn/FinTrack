import { Request, Response } from "express";
import {
  loginService,
  registerService,
  resendOtpService,
  verifyOtpService,
} from "./auth.service";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const data = await registerService(email, password);
  res.status(201).json(data); // { userId }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const data = await loginService(email, password);
  res.json(data);
};

export const verifyOtp = async (req: Request, res: Response) => {
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
      message: (error as Error).message,
    });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
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
