import { Request, Response } from "express";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

import { connectToDatabase, getUsersCollection } from "../db/client";
import { env } from "../config/env";
import { sendMail } from "../lib/mailer";
import { buildVerificationEmail } from "../emails/templates/verification-email";
import { UserDocument, PublicUser } from "../types/user";
import { signAuthToken } from "../middleware/requireAuth";

const toPublicUser = (user: UserDocument): PublicUser => ({
  id: user._id.toHexString(),
  name: user.name,
  email: user.email,
  verified: user.verified,
  avatarUrl: user.avatarUrl ?? null,
  role: user.role ?? null,
  location: user.location ?? null,
  bio: user.bio ?? null,
  timezone: user.timezone ?? null,
  website: user.website ?? null,
});

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const parseObjectId = (value: string) => {
  if (!ObjectId.isValid(value)) {
    return null;
  }
  return new ObjectId(value);
};

export const register = async (req: Request, res: Response) => {
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
    const verificationToken = randomBytes(32).toString("hex");

    const user: UserDocument = {
      _id: new ObjectId(),
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      verified: false,
      verificationToken,
      createdAt: timestamp,
      updatedAt: timestamp,
      avatarUrl: null,
      avatarPublicId: null,
      role: null,
      location: null,
      bio: null,
      timezone: null,
      website: null,
    };

    const verifyUrl = `${env.appBaseUrl}/verify?token=${verificationToken}`;
    const emailContent = buildVerificationEmail({ name, verifyUrl });

    try {
      await sendMail({
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });
    } catch (mailError) {
      console.error("Failed to send verification email", mailError);
      return res.status(502).json({
        error: "Unable to send verification email. Please try again later.",
      });
    }

    await users.insertOne(user);

    res.status(201).json({
      message: "Registration successful. Please check your email to verify.",
    });
  } catch (error) {
    console.error("Registration failed", error);
    res.status(500).json({ error: "Failed to register user" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
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
      { _id: user._id },
      {
        $set: {
          verified: true,
          verificationToken: null,
          updatedAt: Date.now(),
        },
      }
    );

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification failed", error);
    res.status(500).json({ error: "Failed to verify email" });
  }
};

export const login = async (req: Request, res: Response) => {
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

    const token = signAuthToken({ userId: user._id.toHexString() });

    res.json({ token, user: toPublicUser(user) });
  } catch (error) {
    console.error("Login failed", error);
    res.status(500).json({ error: "Failed to login" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const users = await getUsersCollection();
    const objectId = parseObjectId(userId);
    if (!objectId) {
      return res.status(400).json({ error: "Invalid user id" });
    }
    const user = await users.findOne({ _id: objectId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(toPublicUser(user));
  } catch (error) {
    console.error("Failed to fetch profile", error);
    res.status(500).json({ error: "Failed to load profile" });
  }
};
