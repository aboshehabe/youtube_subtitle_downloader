import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://www.google.com");
    return NextResponse.json({ success: true, status: response.status, message: "Server can make external requests" });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error), message: "Server cannot make external requests" });
  }
}
