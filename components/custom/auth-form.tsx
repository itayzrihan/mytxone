import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function AuthForm({
  action,
  children,
  defaultUsername = "",
}: {
  action: any;
  children: React.ReactNode;
  defaultUsername?: string;
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
