import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Plus, LayoutDashboard, LogOut, User } from "lucide-react";
import { signOut } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-3 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/app" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#7c3aed] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">FocusSteps</span>
            </Link>
            <div className="flex items-center gap-1">
              <Link href="/app">
                <Button variant="ghost" size="sm" className="gap-1.5 text-gray-600 hover:text-gray-900">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/app/new">
                <Button variant="ghost" size="sm" className="gap-1.5 text-gray-600 hover:text-gray-900">
                  <Plus className="w-4 h-4" />
                  New Task
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    {session.user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={session.user.image} alt="" className="w-6 h-6 rounded-full" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">{session.user.name?.split(" ")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-sm text-gray-500">{session.user.email}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <Link href="/settings"><DropdownMenuItem>Settings</DropdownMenuItem></Link>
                  <Link href="/pricing"><DropdownMenuItem>Upgrade to Pro</DropdownMenuItem></Link>
                  <DropdownMenuSeparator />
                  <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
                    <DropdownMenuItem asChild>
                      <button type="submit" className="w-full text-left flex items-center gap-2 text-red-600">
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </DropdownMenuItem>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login"><Button variant="outline" size="sm">Sign in</Button></Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
