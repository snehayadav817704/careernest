import CandidateProfile from "../models/CandidateProfile.js";
import CompanyProfile from "../models/CompanyProfile.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { hashToken, randomToken, signToken } from "../utils/tokens.js";
import { sendEmail } from "../utils/email.js";

function authPayload(user) {
  return { token: signToken(user), user };
}

export async function signup({ name, email, password, role = "candidate", companyName }) {
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError("Email is already registered", 409);

  const { rawToken, hashedToken } = randomToken();
  const user = await User.create({ name, email, password, role, emailVerificationToken: hashedToken });

  if (role === "candidate") {
    await CandidateProfile.create({ user: user._id });
  } else if (role === "employer") {
    await CompanyProfile.create({ owner: user._id, companyName: companyName || `${name}'s Company` });
  }

  const verifyUrl = `${process.env.FRONTEND_URL}/email-verified?token=${rawToken}`;
  await sendEmail({
    to: user.email,
    subject: "Verify your CareerNest email",
    html: `<p>Welcome to CareerNest. Verify your email here: <a href="${verifyUrl}">${verifyUrl}</a></p>`
  });

  return authPayload(user);
}

export async function login({ email, password }) {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError("Invalid email or password", 401);
  }

  return authPayload(user);
}

export async function verifyEmail(token) {
  const user = await User.findOne({ emailVerificationToken: hashToken(token) }).select("+emailVerificationToken");
  if (!user) throw new ApiError("Invalid verification token", 400);

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();
  return user;
}

export async function forgotPassword(email) {
  const user = await User.findOne({ email }).select("+passwordResetToken +passwordResetExpires");
  if (!user) return;

  const { rawToken, hashedToken } = randomToken();
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 30 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;
  await sendEmail({
    to: user.email,
    subject: "Reset your CareerNest password",
    html: `<p>Reset your password here: <a href="${resetUrl}">${resetUrl}</a></p>`
  });
}

export async function resetPassword(token, password) {
  const user = await User.findOne({
    passwordResetToken: hashToken(token),
    passwordResetExpires: { $gt: Date.now() }
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) throw new ApiError("Invalid or expired reset token", 400);

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  return authPayload(user);
}
