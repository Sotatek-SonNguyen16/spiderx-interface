import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { headers } from "next/headers";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = "/api/auth/chat/callback";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return new NextResponse(
      `
      <script>
        window.opener?.postMessage({ error: "No code provided" }, "*");
        window.close();
      </script>
    `,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  const headersList = await headers();
  const host = headersList.get("host") || "";
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  try {
    // 1. Exchange authorization code for tokens
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          code,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: `${origin}${REDIRECT_URI}`,
          grant_type: "authorization_code",
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { access_token, refresh_token } = tokenRes.data;

    if (!refresh_token) {
      throw new Error("No refresh_token received from Google. Please ensure prompt=consent is set.");
    }

    // 2. Return success response với refresh_token
    // Refresh token sẽ được gửi đến Backend từ client-side
    // Client sẽ gọi API /api/integration/connect với refresh_token sau khi nhận được từ popup
    const html = `
      <script>
        const data = {
          success: true,
          googleRefreshToken: "${refresh_token}",
          googleAccessToken: "${access_token}"
        };
        
        window.opener?.postMessage(data, "*");
        window.close();
      </script>
    `;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (e: any) {
    console.error("OAuth callback error:", e);
    const errorHtml = `
      <script>
        window.opener?.postMessage({ 
          error: "OAuth flow failed: ${e.message.replace(/"/g, '\\"')}" 
        }, "*");
        window.close();
      </script>
    `;
    return new NextResponse(errorHtml, {
      headers: { "Content-Type": "text/html" },
    });
  }
}

