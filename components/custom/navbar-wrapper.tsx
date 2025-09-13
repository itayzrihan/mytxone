import { auth } from "@/app/(auth)/auth";
import { Navbar } from "./navbar";

export const NavbarWrapper = async () => {
  let session = await auth();

  return <Navbar session={session} />;
};

// Export as Navbar for compatibility
export { NavbarWrapper as Navbar };
