# Integration Guide: 2FA in Login/Register Forms

This guide shows how to integrate 2FA verification into your existing login and register flows.

## Option 1: Two-Step Modal (Recommended)

After successful password authentication, show a 2FA verification modal if the user has 2FA enabled.

### Example Implementation in Login Page

```tsx
// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/custom/auth-form";
import { TwoFAVerificationForm } from "@/components/custom/two-fa-verification-form";
import { login } from "../actions";

export default function LoginPage() {
  const router = useRouter();
  const [showTwoFA, setShowTwoFA] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);

  const handleLoginSubmit = async (formData: FormData) => {
    const result = await login(undefined, formData);
    
    if (result.status === "success") {
      // Check if user has 2FA enabled
      const email = formData.get("email") as string;
      const userHas2FA = await checkUser2FAStatus(email);
      
      if (userHas2FA) {
        setShowTwoFA(true);
        setLoginAttempted(true);
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      {!showTwoFA ? (
        <AuthForm action={handleLoginSubmit}>
          <SubmitButton>Sign in</SubmitButton>
        </AuthForm>
      ) : (
        <TwoFAVerificationForm
          onVerificationComplete={(verified) => {
            if (verified) {
              router.push("/dashboard");
            }
          }}
        />
      )}
    </div>
  );
}

async function checkUser2FAStatus(email: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/auth/check-2fa?email=${encodeURIComponent(email)}`);
    const data = await response.json();
    return data.hasTwoFA || false;
  } catch {
    return false;
  }
}
```

### Create the Check 2FA Status Endpoint

```typescript
// app/api/auth/check-2fa/route.ts
import { getDb } from "@/db/queries";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    const userResult = await getDb()
      .select()
      .from(user)
      .where(eq(user.email, email));

    if (userResult.length === 0) {
      return new Response(
        JSON.stringify({ hasTwoFA: false }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ hasTwoFA: userResult[0].totpEnabled || false }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (error) {
    console.error("Error checking 2FA status:", error);
    return new Response(
      JSON.stringify({ error: "Failed to check 2FA status" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
```

## Option 2: Add 2FA Setup to Registration

After successful registration, offer users to enable 2FA.

### Example Implementation in Register Page

```tsx
// app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/custom/auth-form";
import { TwoFASetupModal } from "@/components/custom/two-fa-setup-modal";
import { register } from "../actions";

export default function RegisterPage() {
  const router = useRouter();
  const [showTwoFASetup, setShowTwoFASetup] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleRegisterSubmit = async (formData: FormData) => {
    setUserEmail(formData.get("email") as string);
    const result = await register(undefined, formData);
    
    if (result.status === "success") {
      // Show 2FA setup offer
      setShowTwoFASetup(true);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      {!showTwoFASetup ? (
        <AuthForm action={handleRegisterSubmit}>
          <SubmitButton>Sign Up</SubmitButton>
        </AuthForm>
      ) : (
        <>
          <TwoFASetupModal
            isOpen={showTwoFASetup}
            onClose={() => {
              setShowTwoFASetup(false);
              router.push("/dashboard");
            }}
            userEmail={userEmail}
          />
        </>
      )}
    </div>
  );
}
```

## Option 3: Account Settings 2FA Management

Add a 2FA toggle in the account settings page.

### Example Settings Component

```tsx
// components/custom/account-2fa-settings.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TwoFASetupModal } from "./two-fa-setup-modal";
import { toast } from "sonner";

interface AccountTwoFASettingsProps {
  userEmail: string;
}

export function AccountTwoFASettings({ userEmail }: AccountTwoFASettingsProps) {
  const [isTwoFAEnabled, setIsTwoFAEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSetupModal, setShowSetupModal] = useState(false);

  useEffect(() => {
    checkTwoFAStatus();
  }, []);

  const checkTwoFAStatus = async () => {
    try {
      const response = await fetch(`/api/auth/check-2fa?email=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      setIsTwoFAEnabled(data.hasTwoFA || false);
    } catch (error) {
      console.error("Error checking 2FA status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    if (isTwoFAEnabled) {
      // Show disable confirmation
      if (confirm("Are you sure you want to disable 2FA?")) {
        // Call disable endpoint
        await disable2FA();
      }
    } else {
      setShowSetupModal(true);
    }
  };

  const disable2FA = async () => {
    try {
      const response = await fetch("/api/auth/disable-2fa", {
        method: "POST",
      });

      if (response.ok) {
        toast.success("2FA disabled");
        setIsTwoFAEnabled(false);
      } else {
        toast.error("Failed to disable 2FA");
      }
    } catch (error) {
      toast.error("Error disabling 2FA");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
            <p className="text-sm text-zinc-400 mt-1">
              {isTwoFAEnabled
                ? "2FA is enabled and active on your account"
                : "Protect your account with two-factor authentication"}
            </p>
          </div>
          <Button
            onClick={handleToggle2FA}
            variant={isTwoFAEnabled ? "destructive" : "default"}
          >
            {isTwoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
          </Button>
        </div>
      </Card>

      <TwoFASetupModal
        isOpen={showSetupModal}
        onClose={() => {
          setShowSetupModal(false);
          checkTwoFAStatus();
        }}
        userEmail={userEmail}
      />
    </>
  );
}
```

### Create Disable 2FA Endpoint

```typescript
// app/api/auth/disable-2fa/route.ts
import { auth } from "@/app/(auth)/auth";
import { updateUser } from "@/db/queries";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: "User not authenticated" }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    await updateUser(session.user.id, {
      totpSecret: null,
      totpEnabled: false,
      totpSeedId: null,
      totpSetupCompleted: null,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (error) {
    console.error("Error disabling 2FA:", error);
    return new Response(
      JSON.stringify({ error: "Failed to disable 2FA" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
```

## Migration Steps

1. **Add environment variables** (`.env.local`):
   ```env
   TOTP_ENCRYPTION_KEY=your_32_byte_hex_key
   UPSTASH_REDIS_REST_URL=your_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_redis_token
   ```

2. **Run database migration**:
   ```bash
   npm run build
   ```

3. **Choose integration method** (Option 1, 2, or 3)

4. **Update login page** with 2FA check

5. **Update register page** with 2FA offer

6. **Add settings page** with 2FA management

7. **Test thoroughly**:
   - Test setup flow
   - Test verification
   - Test disable
   - Test recovery

## Testing Checklist

- [ ] User can enable 2FA from settings
- [ ] 2FA setup redirects to Legitate
- [ ] Callback stores encrypted secret
- [ ] User can verify with correct code
- [ ] User cannot verify with wrong code
- [ ] Rate limiting works (5 attempts/15 min)
- [ ] User can disable 2FA
- [ ] New registrations can skip 2FA
- [ ] Login requires 2FA if enabled
- [ ] Session is properly managed

## Monitoring & Logging

Log all 2FA events:

```typescript
// In verify-2fa endpoint
console.log(`2FA attempt for user ${userId}:`, {
  timestamp: new Date().toISOString(),
  success: isValid,
  ip: request.headers.get("x-forwarded-for"),
  userAgent: request.headers.get("user-agent"),
});
```

## Security Notes

1. **Never expose secrets** in API responses
2. **Always encrypt secrets** before storage
3. **Validate timestamps** to prevent replay attacks
4. **Rate limit** verification attempts
5. **Log all events** for security auditing
6. **Clear 2FA flags** on logout
7. **Require HTTPS** in production

## Troubleshooting

**Q: How do I generate a TOTP_ENCRYPTION_KEY?**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Q: User is locked out after 5 failed attempts?**
A: They must wait 15 minutes before trying again.

**Q: How do I reset a user's 2FA?**
A: Call the disable-2fa endpoint as admin or have user re-authenticate.

**Q: Can users use any authenticator app?**
A: Yes! Any RFC 6238 compliant app works:
- Google Authenticator
- Authy
- Microsoft Authenticator
- LastPass Authenticator
- 1Password
- And many more...
