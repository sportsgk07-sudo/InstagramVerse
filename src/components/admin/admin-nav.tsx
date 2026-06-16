"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Download,
  Users,
  Activity,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/downloads", label: "Downloads", icon: Download },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/api-usage", label: "API Usage", icon: Activity },
  { href: "/admin/logs", label: "System Logs", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {links.map((link) => (
        <Link key={link.href} href={link.href}>
          <Button
            variant={pathname === link.href ? "default" : "outline"}
            size="sm"
            className={cn("gap-2")}
          >
            <link.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{link.label}</span>
          </Button>
        </Link>
      ))}
      <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </nav>
  );
}
