import { Request, Response } from "express";
import {
  loginService,
  registerService,
  resendOtpService,
  verifyOtpService,
} from "./auth.service";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const data = await registerService(email, password);
  res.status(201).json(data); // { userId }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const data = await loginService(email, password);
  res.json(data);
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({ message: "userId and otp are required" });
  }

  try {
    const result = await verifyOtpService(userId, otp);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
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

