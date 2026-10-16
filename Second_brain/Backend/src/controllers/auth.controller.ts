 
import { Request, Response } from "express";
import userModel from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Case-insensitive lookup also supports older accounts whose email
// may have been stored with uppercase letters.
const findUserByEmail = (email: string) =>
  userModel.findOne({
    email: new RegExp(`^${escapeRegex(normalizeEmail(email))}$`, "i"),
  });

const createToken = (userId: unknown, email: string) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    { id: String(userId), email },
    secret,
    { expiresIn: "1d" }
  );
};

const isBcryptHash = (value: string) =>
  /^\$2[aby]\$\d{2}\$/.test(value);


// ---------------- SIGN UP ----------------

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, password, email } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Name, email and password are required.",
        status: "failed",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Server authentication is not configured.",
        status: "failed",
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({
        message: "An account already exists with this email. Please sign in.",
        status: "failed",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await userModel.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = createToken(user._id, user.email);

    return res.status(201).json({
      message: "Account created successfully.",
      status: "success",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error: any) {
    console.error("SIGNUP ERROR:", error.message);

    if (error?.code === 11000) {
      return res.status(409).json({
        message: "An account already exists with this email.",
        status: "failed",
      });
    }

    return res.status(500).json({
      message: "Unable to create account.",
      status: "failed",
    });
  }
};


// ---------------- SIGN IN ----------------

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
        status: "failed",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Server authentication is not configured.",
        status: "failed",
      });
    }

    // If your schema has select: false on password, this retrieves it.
    const user = await findUserByEmail(email).select("+password");

    if (!user || typeof user.password !== "string" || !user.password) {
      return res.status(401).json({
        message: "Invalid email or password.",
        status: "failed",
      });
    }

    let passwordMatches = false;

    if (isBcryptHash(user.password)) {
      passwordMatches = await bcrypt.compare(password, user.password);
    } else {
      // Temporary compatibility with legacy plain-text passwords.
      passwordMatches = password === user.password;

      // Upgrade a legacy password after a successful login.
      if (passwordMatches) {
        user.password = await bcrypt.hash(password, 12);
        await user.save();
      }
    }

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
        status: "failed",
      });
    }

    const token = createToken(user._id, user.email);

    return res.status(200).json({
      message: "Login successful.",
      status: "success",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error: any) {
    console.error("SIGNIN ERROR:", error.message);

    return res.status(500).json({
      message: "Unable to sign in.",
      status: "failed",
    });
  }
};


// ---------------- GET CURRENT USER ----------------

export const getuser = async (req: Request, res: Response) => {
  try {
    // Your auth middleware must set req.userId from the verified JWT.
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
        status: "failed",
      });
    }

    const user = await userModel
      .findById(userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        status: "failed",
      });
    }

    return res.status(200).json({
      user,
      status: "success",
    });
  } catch (error: any) {
    console.error("GET USER ERROR:", error.message);

    return res.status(500).json({
      message: "Unable to retrieve user.",
      status: "failed",
    });
  }
};


// ---------------- GOOGLE SIGN IN ----------------

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;

    if (typeof credential !== "string" || !credential) {
      return res.status(400).json({
        message: "Google credential is required.",
        status: "failed",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Google authentication is not configured.",
        status: "failed",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.sub || !payload.email) {
      return res.status(401).json({
        message: "Invalid Google account credentials.",
        status: "failed",
      });
    }

    if (payload.email_verified !== true) {
      return res.status(401).json({
        message: "Your Google email must be verified.",
        status: "failed",
      });
    }

    const email = normalizeEmail(payload.email);

    // CRITICAL: Google SIGN IN must never create a new account.
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        message: "Account not found. Please sign up first.",
        status: "failed",
      });
    }

    // Avoid silently connecting an account already linked to
    // a different Google identity.
    if (user.googleId && user.googleId !== payload.sub) {
      return res.status(409).json({
        message: "This account is linked to a different Google account.",
        status: "failed",
      });
    }

    // This only links Google to an EXISTING, verified-email account.
    user.googleId = payload.sub;

    if (payload.picture) {
      user.profilePicture = payload.picture;
    }

    await user.save();

    const token = createToken(user._id, user.email);

    return res.status(200).json({
      message: "Google sign-in successful.",
      status: "success",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
      token,
    });
  } catch (error: any) {
    console.error("GOOGLE LOGIN ERROR:", error.message);

    return res.status(401).json({
      message: "Google authentication failed.",
      status: "failed",
    });
  }
};

 
export const googleSignup = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;

    // 1. Validate the request
    if (typeof credential !== "string" || !credential.trim()) {
      return res.status(400).json({
        status: "failed",
        message: "Google credential is required.",
      });
    }

    // 2. Validate server configuration
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.JWT_SECRET) {
      return res.status(500).json({
        status: "failed",
        message: "Google authentication is not configured.",
      });
    }

    // 3. Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // 4. Validate the verified Google account
    if (
      !payload ||
      !payload.sub ||
      !payload.email ||
      payload.email_verified !== true
    ) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid or unverified Google account.",
      });
    }

    const email = normalizeEmail(payload.email);

    // 5. Check whether the user already exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        status: "failed",
        message: "Account already exists. Please sign in.",
      });
    }

    // 6. Create a new Google user
    const user = await userModel.create({
      name: payload.name || email.split("@")[0],
      email: email,
      googleId: payload.sub,
      profilePicture: payload.picture || "",
    });

    // 7. Generate your application's JWT
    const token = createToken(user._id, user.email);

    // 8. Return the successful response
    return res.status(201).json({
      status: "success",
      message: "Google signup successful.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
      token,
    });
  } catch (error: any) {
    console.error("GOOGLE SIGNUP ERROR:", error);

    // Handle duplicate email or Google ID
    if (error?.code === 11000) {
      return res.status(409).json({
        status: "failed",
        message: "An account already exists. Please sign in.",
      });
    }

    // Invalid or expired Google credential
    if (
      error?.name === "OAuth2ClientError" ||
      error?.name === "Error" &&
        /token|ticket|audience|expired|verification/i.test(
          error?.message || ""
        )
    ) {
      return res.status(401).json({
        status: "failed",
        message: "Google credential is invalid or expired.",
      });
    }

    return res.status(500).json({
      status: "failed",
      message: "Unable to create Google account.",
    });
  }
};
