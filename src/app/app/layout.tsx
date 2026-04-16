import { auth, signOut } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LayoutDashboard, LogOut, Plus, User, Zap } from "lucide-react";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="min-h-screen px-4 pb-10 pt-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        <nav className="focus-panel mb-8 flex items-center justify-between rounded-[2rem] px-4 py-4 md:px-6">
          <div className="flex items-center gap-3 md:gap-6">
            <Link href="/app" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal text-white shadow-glow">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <p className="font-display text-3xl leading-none text-ink">FocusSteps</p>
                <p className="text-[10px] uppercase tracking-[0.28em] text-ink-soft">Working session</p>
              </div>
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              <Link href="/app">
                <Button variant="ghost" className="rounded-full text-ink">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/app/new">
                <Button variant="ghost" className="rounded-full text-ink">
                  <Plus className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              </Link>
            </div>
          </div>

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full border-line bg-white/70 px-3 text-ink">
                  {session.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={session.user.image} alt="" className="mr-2 h-7 w-7 rounded-full object-cover" />
                  ) : (
                    <User className="mr-2 h-4 w-4" />
                  )}
                  {session.user.name?.split(" ")[0] ?? "Account"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-3xl border-line bg-[rgba(248,242,233,0.98)] p-2">
                <DropdownMenuItem className="rounded-2xl text-sm text-ink-soft focus:bg-white/80">
                  {session.user.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link href="/settings">
                  <DropdownMenuItem className="rounded-2xl focus:bg-white/80">Settings</DropdownMenuItem>
                </Link>
                <Link href="/pricing">
                  <DropdownMenuItem className="rounded-2xl focus:bg-white/80">Upgrade to Pro</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <form action={handleSignOut}>
                  <DropdownMenuItem asChild className="rounded-2xl text-red-700 focus:bg-white/80">
                    <button type="submit" className="flex w-full items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className="rounded-full bg-clay px-5 text-white hover:bg-[#b45630]">Sign in</Button>
            </Link>
          )}
        </nav>

        <main>{children}</main>
      </div>
    </div>
  );
}
