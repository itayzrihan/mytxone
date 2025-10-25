import { compare } from "bcrypt-ts";
import { getUser } from "@/db/queries";
import { signIn } from "@/app/(auth)/auth";

/**
 * POST /api/auth/signin-with-2fa
 * Signs in user after 2FA verification
 * Body: { email: string, password: string }
 * 
 * This endpoint is called after TOTP verification
 * It completes the authentication process
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Missing email or password" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    // Verify credentials
    const users = await getUser(email);
    if (users.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    const user = users[0];
    const passwordsMatch = await compare(password, user.password!);

    if (!passwordsMatch) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    // Credentials valid and 2FA already verified
    // Sign in the user
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return new Response(
      JSON.stringify({ success: true, message: "Signed in successfully" }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in signin-with-2fa:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
