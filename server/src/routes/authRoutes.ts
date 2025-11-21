import { Router } from "express";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

import {
  getUsersCollection,
  connectToDatabase,
} from "../db/client";
import { env } from "../config/env";
import { sendMail } from "../lib/mailer";
import { UserDocument, PublicUser } from "../types/user";
import { signAuthToken, requireAuth } from "../middleware/requireAuth";

const authRouter = Router();

const toPublicUser = (user: UserDocument): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  verified: user.verified,
});

const normalizeEmail = (email: string) => email.trim().toLowerCase();

authRouter.post("/register", async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email =
    typeof req.body?.email === "string" ? normalizeEmail(req.body.email) : "";
  const password =
    typeof req.body?.password === "string" ? req.body.password : "";

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  try {
    await connectToDatabase();
    const users = await getUsersCollection();
    const existing = await users.findOne({ email });

    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const timestamp = Date.now();
    const verificationToken = randomUUID();

    const user: UserDocument = {
      id: randomUUID(),
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      verified: false,
      verificationToken,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await users.insertOne(user);

    const verifyUrl = `${env.appBaseUrl}/verify?token=${verificationToken}`;
    await sendMail({
      to: email,
      subject: "Verify your Smart Todo account",
      html: `<p>Hello ${name},</p>
             <p>Thanks for joining Smart Todo. Please verify your account by clicking the link below:</p>
             <p><a href="${verifyUrl}" target="_blank" rel="noopener">Verify your email</a></p>
             <p>If you did not request this, please ignore this message.</p>`,
      text: `Hello ${name},\n\nVerify your email: ${verifyUrl}`,
    });

    res.status(201).json({
      message: "Registration successful. Please check your email to verify.",
    });
  } catch (error) {
    console.error("Registration failed", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

authRouter.post("/verify", async (req, res) => {
  const token =
    typeof req.body?.token === "string" ? req.body.token.trim() : "";
  if (!token) {
    return res.status(400).json({ error: "Verification token is required" });
  }

  try {
    const users = await getUsersCollection();
    const user = await users.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ error: "Invalid verification token" });
    }

    if (user.verified) {
      return res.json({ message: "Account already verified" });
    }

    await users.updateOne(
      { id: user.id },
      { $set: { verified: true, verificationToken: null, updatedAt: Date.now() } }
    );

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification failed", error);
    res.status(500).json({ error: "Failed to verify email" });
  }
});

authRouter.post("/login", async (req, res) => {
  const email =
    typeof req.body?.email === "string" ? normalizeEmail(req.body.email) : "";
  const password =
    typeof req.body?.password === "string" ? req.body.password : "";

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const users = await getUsersCollection();
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.verified) {
      return res.status(403).json({
        error: "Please verify your email before logging in",
      });
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signAuthToken({ userId: user.id });

    res.json({ token, user: toPublicUser(user) });
  } catch (error) {
    console.error("Login failed", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

authRouter.get("/me", requireAuth, async (req, res) => {
  try {
    const users = await getUsersCollection();
    const user = await users.findOne({ id: req.userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(toPublicUser(user));
  } catch (error) {
    console.error("Failed to fetch profile", error);
    res.status(500).json({ error: "Failed to load profile" });
  }
});

export { authRouter };

