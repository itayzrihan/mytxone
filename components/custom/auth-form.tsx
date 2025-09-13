import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function AuthForm({
  action,
  children,
  defaultEmail = "",
}: {
  action: any;
  children: React.ReactNode;
  defaultEmail?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="email"
            className="text-cyan-300 font-medium"
          >
            Email Address
          </Label>

          <Input
            id="email"
            name="email"
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-zinc-400 focus:border-cyan-400 focus:ring-cyan-400/50"
            type="email"
            placeholder="user@acme.com"
            autoComplete="email"
            required
            defaultValue={defaultEmail}
          />
        </div>

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
