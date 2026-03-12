import { Link } from "@tanstack/react-router";
import { Github, Leaf, Twitter } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

  return (
    <footer className="border-t border-white/5 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-primary" />
              </div>
              <span className="font-display font-bold text-lg">
                <span className="text-primary">Coke</span>
                <span>Cycle</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Smart bottle recycling rewards platform. Turn every bottle into an
              opportunity to earn and help the planet.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/scan"
                  className="hover:text-primary transition-colors"
                >
                  Scan Bottle
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/leaderboard"
                  className="hover:text-primary transition-colors"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  to="/centers"
                  className="hover:text-primary transition-colors"
                >
                  Collection Centers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">
              Impact
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>45,200+ Bottles Recycled</li>
              <li>1.2 Tons Plastic Saved</li>
              <li>3.4 Tons Carbon Reduced</li>
              <li>2,400+ Active Recyclers</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-muted-foreground text-sm">
            © {year} CokeCycle. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs">
            Built with ❤️ using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
