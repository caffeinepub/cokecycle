import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Leaf,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  QrCode,
  ShieldCheck,
  Trophy,
  X,
} from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const navLinks = [
  { href: "/", label: "Home", icon: Leaf },
  { href: "/scan", label: "Scan", icon: QrCode },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/centers", label: "Centers", icon: MapPin },
];

export function Navbar() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Leaf className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-lg">
            <span className="text-primary">Coke</span>
            <span className="text-foreground">Cycle</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5",
                pathname === link.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5",
              )}
              data-ocid="nav.link"
            >
              <link.icon className="w-3.5 h-3.5" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth + Admin */}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn && (
            <Link to="/admin">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                data-ocid="nav.admin.link"
              >
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                Admin
              </Button>
            </Link>
          )}
          {isLoggedIn ? (
            <Button
              variant="outline"
              size="sm"
              onClick={clear}
              className="border-border text-muted-foreground hover:text-foreground"
              data-ocid="nav.logout.button"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              Logout
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="nav.login.button"
            >
              <LogIn className="w-4 h-4 mr-1.5" />
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </Button>
          )}
        </div>

        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" data-ocid="nav.mobile.button">
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="glass border-l border-white/10 w-72"
          >
            <div className="flex flex-col gap-2 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3",
                    pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                  )}
                  data-ocid="nav.mobile.link"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-border">
                {isLoggedIn ? (
                  <Button
                    variant="outline"
                    className="w-full border-border"
                    onClick={() => {
                      clear();
                      setMobileOpen(false);
                    }}
                    data-ocid="nav.mobile.logout.button"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-primary text-primary-foreground"
                    onClick={() => {
                      login();
                      setMobileOpen(false);
                    }}
                    data-ocid="nav.mobile.login.button"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
