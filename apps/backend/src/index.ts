import express, { Request, Response } from "express";
import cors from "cors"
import bcrypt from "bcryptjs";
import { prisma } from "@repo/db/client";
import { validateUsername, validatePassword } from "./validation";
import jwt from "jsonwebtoken";
const app = express();
app.use(express.json());
app.use(cors())
import dotenv from "dotenv";
import { authMiddleware } from "./middleware";
dotenv.config();
console.log(process.env.PORT);
console.log(process.env.JWT_SECRET);

const secret = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.post("/api/v1/signup", async (req: Request, res: Response) => {
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
  const token = jwt.sign({ userId: user.id }, secret,{expiresIn:"1h"});
  res.json({
    message: "User created successfully",
    user,
    token
  });
});

app.post("/api/v1/signin", async (req: Request, res: Response) => {
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
  const token = jwt.sign({ userId: user.id }, secret,{expiresIn:"1h"});
  res.json({
    message: "User Signed in ",
    user,
    token: token,
  });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});


app.get("/profile", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const userProfile = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    res.json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
});
