import { NextResponse } from "next/server";
import corsHeaders from "./cors";

export function printExceptionLog(logMessage, error) {
    console.log(`==>${logMessage} Exception`);
    console.log(error);
}

export function errorResponse(message, status = 500) {
  return NextResponse.json(
    { error: message },
    { status, headers: corsHeaders }
  );
}

export function successResponse(jsonData, status) {
    return NextResponse.json(jsonData, {
        status: status,
        headers: corsHeaders,
    });
}
