import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const hashed_password = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const match_password = async (candidate_password, password) => {
  return await bcrypt.compare(candidate_password, password);
};

export const get_signed_token = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
