// src/lib/auth.js

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyJWT(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    return decoded;
  } catch (err) {
    console.log("==> Verify Token Exception");
    console.log(err);

    return null;
  }
}

export function isAdmin(request) {
  try {
    const user = verifyJWT(request);

    if (!user) {
      return false;
    }

    return String(user.id) === "-1";
  } catch (err) {
    console.log("==> Admin Check Exception");
    console.log(err);

    return false;
  }
}
