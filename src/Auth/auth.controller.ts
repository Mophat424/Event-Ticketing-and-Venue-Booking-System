// import { Request, Response } from "express";
// import { loginUser, registerUser } from "./auth.service";

// export const register = async (req: Request, res: Response) => {
//   try {
//     const result = await registerUser(req.body);
//     res.status(201).json(result);
//   } catch (error: any) {
//     console.error("Register Error:", error);
//     res.status(400).json({ message: error.message || "Registration failed" });
//   }
// };

// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const result = await loginUser(email, password);
//     res.status(200).json(result);
//   } catch (error: any) {
//     console.error("Login Error:", error);
//     res.status(400).json({ message: error.message || "Login failed" });
//   }
// };





import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";

// Register controller
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Login controller
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};
