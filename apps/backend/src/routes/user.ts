import express, { Request, Response ,Router } from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { prisma } from "@repo/db/client";
import { validateUsername, validatePassword } from "../utils/validation";
import jwt from "jsonwebtoken";
const router:Router = express.Router();
router.use(express.json());
router.use(cors());
console.log(process.env.JWT_SECRET);
const secret = process.env.JWT_SECRET;

router.post("/signup", async (req: Request, res: Response) => {
  const { fullName, username, password } = req.body;
  const validUsername = validateUsername.safeParse(username);
  const validPassword = validatePassword.safeParse(password);
  if (!validUsername.success || !validPassword.success) {
    res.status(403).json({
      message: "Please enter valid type of credentials",
    });
    return;
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });
  if (existingUser) {
    res.json("User already exist");
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
      name: fullName,
    },
  });
  if (!secret) {
    return;
  }
  if (!user) {
    res.json({
      message: "unable to create user",
    });
    return;
  }
  const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });
  res.json({
    message: "User created successfully",
    user,
    token: token,
  });
});

router.post("/signin", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const validUsername = validateUsername.safeParse(username);
  const validPassword = validatePassword.safeParse(password);
  if (!validUsername.success || !validPassword.success) {
    res.status(403).json({
      message: "Please enter valid type of credentials",
    });
    return;
  }
  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });
  if (!user) {
    res.status(404).json({
      message: "unable to find user",
    });
    return;
  }
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    res.status(404).json({
      message: "Password mismatch",
    });
    return;
  }

  if (!secret) {
    return;
  }
  const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });
  res.json({
    message: "User Signed in ",
    user,
    token: token,
  });
});

router.post("/admin-signup", async (req: Request, res: Response) => {
  const { fullName, username, password } = req.body;
  const validUsername = validateUsername.safeParse(username);
  const validPassword = validatePassword.safeParse(password);
  if (!validUsername.success || !validPassword.success) {
    res.status(403).json({
      message: "Please enter valid type of credentials",
    });
    return;
  }

  const existingUser = await prisma.admin.findFirst({
    where: {
      username: username,
    },
  });
  if (existingUser) {
    res.json("User already exist");
    return;
  }
  const admin = await prisma.admin.create({
    data: {
      username: username,
      password: password,
      name: fullName,
    },
  });
  if (!secret) {
    return;
  }
  if (!admin) {
    res.json({
      message: "unable to create admin",
    });
    return;
  }
  const token = jwt.sign({ userId: admin.id }, secret, { expiresIn: "1h" });
  res.json({
    message: "User created successfully",
    admin,
    token: token,
  });
});

router.post("/admin-login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const validUsername = validateUsername.safeParse(username);
  const validPassword = validatePassword.safeParse(password);
  if (!validUsername.success || !validPassword.success) {
    res.status(403).json({
      message: "Please enter valid type of credentials",
    });
    return;
  }
  const admin = await prisma.admin.findFirst({
    where: {
      username: username,
    },
  });
  if (!admin) {
    res.status(404).json({
      message: "unable to find admin",
    });
    return;
  }
  const comparePassword = admin.password === password;
  if (!comparePassword) {
    res.status(404).json({
      message: "Password mismatch",
    });
    return;
  }

  if (!secret) {
    return;
  }
  const token = jwt.sign({ userId: admin.id }, secret, { expiresIn: "1h" });
  res.json({
    message: "User Signed in ",
    admin,
    token: token,
  });
});

export default router;
