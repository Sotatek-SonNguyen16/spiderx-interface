import { NextResponse } from "next/server";
import { headers } from "next/headers";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
// Google Chat scopes - chỉ cần quyền đọc messages và spaces
const SCOPE = "openid email profile https://www.googleapis.com/auth/chat.messages.readonly https://www.googleapis.com/auth/chat.spaces.readonly https://www.googleapis.com/auth/chat.memberships.readonly";

export async function GET(request: Request) {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const REDIRECT_URI = `${origin}/api/auth/google/callback`;

  // OAuth URL với prompt=consent để đảm bảo luôn nhận được refresh_token
  const OAUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=${encodeURIComponent(SCOPE)}&access_type=offline&prompt=consent`;

  return NextResponse.redirect(OAUTH_URL);
}

