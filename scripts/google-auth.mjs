#!/usr/bin/env node
// One-time helper: obtains the Google OAuth REFRESH TOKEN the booking system
// needs to read free/busy and create events (with Meet) on the owner's calendar.
//
// Usage (PowerShell):
//   $env:GOOGLE_OAUTH_CLIENT_ID="..."; $env:GOOGLE_OAUTH_CLIENT_SECRET="..."
//   node scripts/google-auth.mjs
//
// Requirements in Google Cloud: Calendar API enabled; OAuth consent screen
// "External" and published "In production" (in "Testing" the refresh token
// expires after 7 days); OAuth client of type "Desktop app".
// The token is printed ONCE to this terminal. Store it in Vercel as
// GOOGLE_OAUTH_REFRESH_TOKEN. Never commit it.
import { createHash, randomBytes } from "node:crypto";
import { createServer } from "node:http";

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  console.error("Set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET first.");
  process.exit(1);
}

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.freebusy",
];
const state = randomBytes(16).toString("hex");
const verifier = randomBytes(48).toString("base64url");
const challenge = createHash("sha256").update(verifier).digest("base64url");

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }
  const finish = (status, text) => {
    res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" }).end(text);
    server.close();
  };
  if (url.searchParams.get("state") !== state || !url.searchParams.get("code")) {
    finish(400, "Authorization failed (state mismatch or missing code). Run the script again.");
    console.error("Authorization failed:", url.searchParams.get("error") ?? "state mismatch");
    process.exitCode = 1;
    return;
  }
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: url.searchParams.get("code"),
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri(),
        grant_type: "authorization_code",
        code_verifier: verifier,
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.refresh_token) {
      finish(500, "Google did not return a refresh token. See the terminal.");
      console.error(
        "No refresh token returned:",
        data.error ?? response.status,
        data.error_description ?? "",
        "\nRevoke the app at https://myaccount.google.com/permissions and run again.",
      );
      process.exitCode = 1;
      return;
    }
    finish(200, "Listo. Vuelve a la terminal: el refresh token está ahí. Puedes cerrar esta pestaña.");
    console.log("\nGOOGLE_OAUTH_REFRESH_TOKEN=" + data.refresh_token);
    console.log("\nGranted scopes:", data.scope);
    console.log("Add it to Vercel (Production) and to .env.local. Do not commit it.");
  } catch (error) {
    finish(500, "Token exchange failed. See the terminal.");
    console.error("Token exchange failed:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
});

function redirectUri() {
  const address = server.address();
  return `http://127.0.0.1:${address.port}/callback`;
}

server.listen(0, "127.0.0.1", () => {
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri(),
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  }).toString();
  console.log("Open this URL in the browser signed in as the calendar owner:\n");
  console.log(authUrl.toString());
  console.log("\nWaiting for Google to redirect back to", redirectUri(), "...");
});
