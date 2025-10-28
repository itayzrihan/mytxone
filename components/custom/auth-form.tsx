import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function AuthForm({
  action,
  children,
  defaultUsername = "",
  includeProfileFields = false,
}: {
  action: any;
  children: React.ReactNode;
  defaultUsername?: string;
  includeProfileFields?: boolean;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="username"
            className="text-cyan-300 font-medium"
          >
            Username
          </Label>

          <Input
            id="username"
            name="username"
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-zinc-400 focus:border-cyan-400 focus:ring-cyan-400/50"
            type="text"
            placeholder="john_doe"
            autoComplete="username"
            required
            defaultValue={defaultUsername}
          />
        </div>

        {includeProfileFields && (
          <>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="fullName"
                className="text-cyan-300 font-medium"
              >
                Full Name
              </Label>

              <Input
                id="fullName"
                name="fullName"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-zinc-400 focus:border-cyan-400 focus:ring-cyan-400/50"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="notMytxEmail"
                className="text-cyan-300 font-medium"
              >
                Email Address
              </Label>

              <Input
                id="notMytxEmail"
                name="notMytxEmail"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-zinc-400 focus:border-cyan-400 focus:ring-cyan-400/50"
                type="email"
                placeholder="john@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="phoneNumber"
                className="text-cyan-300 font-medium"
              >
                Phone Number
              </Label>

              <Input
                id="phoneNumber"
                name="phoneNumber"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-zinc-400 focus:border-cyan-400 focus:ring-cyan-400/50"
                type="tel"
                placeholder="+1 (555) 123-4567"
                autoComplete="tel"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="profileImageUrl"
                className="text-cyan-300 font-medium"
              >
                Profile Image URL
              </Label>

              <Input
                id="profileImageUrl"
                name="profileImageUrl"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-zinc-400 focus:border-cyan-400 focus:ring-cyan-400/50"
                type="url"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </>
        )}

        <div className="flex flex-col gap-2">
          <Label
            htmlFor="password"
            className="text-cyan-300 font-medium"
          >
            Password
          </Label>

          <Input
            id="password"
            name="password"
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-zinc-400 focus:border-cyan-400 focus:ring-cyan-400/50"
            type="password"
            required
          />
        </div>
      </div>

      {children}
    </form>
  );
}
