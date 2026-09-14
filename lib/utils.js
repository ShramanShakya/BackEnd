import { NextResponse } from "next/server";

export function printExceptionLog(logMessage, error) {
  console.log(`==>${logMessage} Exception`);
  console.log(error);
}

export function errorResponse(message, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function successResponse(jsonData, status) {
  return NextResponse.json(jsonData, { status });
}