// src/app/api/user/[user_id]/password/route.js

import { getClientPromise } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";
import { errorResponse, successResponse, printExceptionLog } from "@/lib/utils";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export async function PUT(request, { params }) {
  if (!isAdmin(request)) {
    return errorResponse("Unauthorized Request", 403);
  }

  const { user_id } = await params;

  try {
    const data = await request.json();
    const newPassword = data.password;

    if (!newPassword || newPassword.length < 6) {
      return errorResponse("Password must be at least 6 characters", 400);
    }

    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME);

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const updateResult = await db.collection("user").updateOne(
      { _id: new ObjectId(user_id) },
      { $set: { password: hashedPassword } },
    );

    if (updateResult.matchedCount === 0) {
      return errorResponse("User not found", 404);
    }

    return successResponse({ message: "Password updated successfully" }, 200);
  } catch (error) {
    printExceptionLog("PUT User Password Exception", error);
    return errorResponse("Password update failed", 500);
  }
}